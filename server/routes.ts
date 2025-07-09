import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateImage, generateBabyTransformPrompt, testOpenAIConnection } from "./services/openai";
import { insertThemeSchema, insertGeneratedImageSchema, insertBabyTransformSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Test OpenAI connection at startup
  console.log("Testing OpenAI connection...");
  await testOpenAIConnection();
  
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const openaiStatus = await testOpenAIConnection();
      res.json({ 
        status: "ok", 
        openai: openaiStatus ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        openai: "disconnected",
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Get all themes or filter by category
  app.get("/api/themes", async (req, res) => {
    try {
      const category = req.query.category as string;
      const themes = await storage.getThemes(category);
      res.json(themes);
    } catch (error) {
      console.error("Error fetching themes:", error);
      res.status(500).json({ error: "Failed to fetch themes" });
    }
  });

  // Get single theme
  app.get("/api/themes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const theme = await storage.getTheme(id);
      
      if (!theme) {
        return res.status(404).json({ error: "Theme not found" });
      }
      
      res.json(theme);
    } catch (error) {
      console.error("Error fetching theme:", error);
      res.status(500).json({ error: "Failed to fetch theme" });
    }
  });

  // Create new theme (admin only)
  app.post("/api/themes", async (req, res) => {
    try {
      const themeData = insertThemeSchema.parse(req.body);
      const theme = await storage.createTheme(themeData);
      res.status(201).json(theme);
    } catch (error) {
      console.error("Error creating theme:", error);
      res.status(400).json({ error: "Invalid theme data" });
    }
  });

  // Update theme (admin only)
  app.put("/api/themes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const themeData = insertThemeSchema.partial().parse(req.body);
      const theme = await storage.updateTheme(id, themeData);
      res.json(theme);
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(400).json({ error: "Invalid theme data" });
    }
  });

  // Delete theme (admin only)
  app.delete("/api/themes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTheme(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting theme:", error);
      res.status(500).json({ error: "Failed to delete theme" });
    }
  });

  // Generate image from theme
  app.post("/api/generate/:themeId", async (req, res) => {
    try {
      const themeId = parseInt(req.params.themeId);
      const theme = await storage.getTheme(themeId);
      
      if (!theme) {
        return res.status(404).json({ error: "Theme not found" });
      }

      // Generate image using OpenAI
      const result = await generateImage(theme.prompt);
      
      // Save generated image record
      const imageData = insertGeneratedImageSchema.parse({
        themeId: themeId,
        userId: req.body.userId || null,
        imageUrl: result.imageUrl,
        originalPrompt: result.prompt,
        generationTime: result.generationTime,
      });
      
      const generatedImage = await storage.createGeneratedImage(imageData);
      
      // Increment theme usage count
      await storage.incrementThemeUsage(themeId);
      
      res.json({
        ...generatedImage,
        generationTime: result.generationTime,
      });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Get recent generated images
  app.get("/api/recent-images", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const images = await storage.getRecentGeneratedImages(limit);
      res.json(images);
    } catch (error) {
      console.error("Error fetching recent images:", error);
      res.status(500).json({ error: "Failed to fetch recent images" });
    }
  });

  // Get user's generated images
  app.get("/api/user-images/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const images = await storage.getGeneratedImages(userId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching user images:", error);
      res.status(500).json({ error: "Failed to fetch user images" });
    }
  });

  // Baby transform upload and generation
  app.post("/api/baby-transform", upload.single("photo"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.body.userId ? parseInt(req.body.userId) : null;
      
      // Generate baby transformation prompt
      const transformPrompt = await generateBabyTransformPrompt(
        "Transform this person into a cute baby version while maintaining their key facial features and characteristics"
      );
      
      // Generate the baby image
      const result = await generateImage(transformPrompt);
      
      // Save baby transform record
      const transformData = insertBabyTransformSchema.parse({
        userId: userId,
        originalImageUrl: `/uploads/${req.file.filename}`,
        transformedImageUrl: result.imageUrl,
      });
      
      const babyTransform = await storage.createBabyTransform(transformData);
      
      // Clean up uploaded file after processing
      setTimeout(() => {
        try {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up uploaded file:", cleanupError);
        }
      }, 1000);
      
      res.json({
        ...babyTransform,
        generationTime: result.generationTime,
      });
    } catch (error) {
      console.error("Error processing baby transform:", error);
      res.status(500).json({ error: "Failed to process baby transformation" });
    }
  });

  // Get user's baby transforms
  app.get("/api/baby-transforms/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transforms = await storage.getBabyTransforms(userId);
      res.json(transforms);
    } catch (error) {
      console.error("Error fetching baby transforms:", error);
      res.status(500).json({ error: "Failed to fetch baby transforms" });
    }
  });

  // Get analytics data
  app.get("/api/analytics", async (req, res) => {
    try {
      const totalImages = await storage.getGeneratedImages();
      const totalThemes = await storage.getThemes();
      const recentImages = await storage.getRecentGeneratedImages(7);
      
      // Calculate usage by category
      const categoryUsage = totalThemes.reduce((acc: any, theme) => {
        acc[theme.category] = (acc[theme.category] || 0) + theme.usageCount;
        return acc;
      }, {});

      // Get most popular themes
      const popularThemes = totalThemes
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5);

      res.json({
        totalImages: totalImages.length,
        totalThemes: totalThemes.length,
        recentGenerations: recentImages.length,
        categoryUsage,
        popularThemes,
        totalGenerations: totalThemes.reduce((sum, theme) => sum + theme.usageCount, 0),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Serve uploaded files
  app.get("/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), "uploads", filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
