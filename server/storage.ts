import { 
  users, 
  themes, 
  generatedImages, 
  babyTransforms,
  type User, 
  type InsertUser, 
  type Theme, 
  type InsertTheme,
  type GeneratedImage,
  type InsertGeneratedImage,
  type BabyTransform,
  type InsertBabyTransform
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Themes
  getThemes(category?: string): Promise<Theme[]>;
  getTheme(id: number): Promise<Theme | undefined>;
  createTheme(theme: InsertTheme): Promise<Theme>;
  updateTheme(id: number, theme: Partial<InsertTheme>): Promise<Theme>;
  deleteTheme(id: number): Promise<void>;
  incrementThemeUsage(id: number): Promise<void>;
  
  // Generated Images
  getGeneratedImages(userId?: number): Promise<GeneratedImage[]>;
  createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
  getRecentGeneratedImages(limit: number): Promise<GeneratedImage[]>;
  
  // Baby Transforms
  createBabyTransform(transform: InsertBabyTransform): Promise<BabyTransform>;
  getBabyTransforms(userId?: number): Promise<BabyTransform[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getThemes(category?: string): Promise<Theme[]> {
    const query = db.select().from(themes);
    
    if (category) {
      return await query.where(and(eq(themes.category, category), eq(themes.isActive, true)));
    }
    
    return await query.where(eq(themes.isActive, true)).orderBy(desc(themes.usageCount));
  }

  async getTheme(id: number): Promise<Theme | undefined> {
    const [theme] = await db.select().from(themes).where(eq(themes.id, id));
    return theme || undefined;
  }

  async createTheme(theme: InsertTheme): Promise<Theme> {
    const [newTheme] = await db
      .insert(themes)
      .values({
        ...theme,
        updatedAt: new Date(),
      })
      .returning();
    return newTheme;
  }

  async updateTheme(id: number, theme: Partial<InsertTheme>): Promise<Theme> {
    const [updatedTheme] = await db
      .update(themes)
      .set({
        ...theme,
        updatedAt: new Date(),
      })
      .where(eq(themes.id, id))
      .returning();
    return updatedTheme;
  }

  async deleteTheme(id: number): Promise<void> {
    await db.delete(themes).where(eq(themes.id, id));
  }

  async incrementThemeUsage(id: number): Promise<void> {
    await db
      .update(themes)
      .set({
        usageCount: sql`${themes.usageCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(themes.id, id));
  }

  async getGeneratedImages(userId?: number): Promise<GeneratedImage[]> {
    const query = db.select().from(generatedImages);
    
    if (userId) {
      return await query.where(eq(generatedImages.userId, userId)).orderBy(desc(generatedImages.createdAt));
    }
    
    return await query.orderBy(desc(generatedImages.createdAt));
  }

  async createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage> {
    const [newImage] = await db
      .insert(generatedImages)
      .values(image)
      .returning();
    return newImage;
  }

  async getRecentGeneratedImages(limit: number): Promise<GeneratedImage[]> {
    return await db
      .select()
      .from(generatedImages)
      .orderBy(desc(generatedImages.createdAt))
      .limit(limit);
  }

  async createBabyTransform(transform: InsertBabyTransform): Promise<BabyTransform> {
    const [newTransform] = await db
      .insert(babyTransforms)
      .values(transform)
      .returning();
    return newTransform;
  }

  async getBabyTransforms(userId?: number): Promise<BabyTransform[]> {
    const query = db.select().from(babyTransforms);
    
    if (userId) {
      return await query.where(eq(babyTransforms.userId, userId)).orderBy(desc(babyTransforms.createdAt));
    }
    
    return await query.orderBy(desc(babyTransforms.createdAt));
  }
}

export const storage = new DatabaseStorage();
