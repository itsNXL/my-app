import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'games', 'movies', 'tv', 'baby'
  prompt: text("prompt").notNull(),
  previewImage: text("preview_image"),
  isActive: boolean("is_active").default(true).notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const generatedImages = pgTable("generated_images", {
  id: serial("id").primaryKey(),
  themeId: integer("theme_id").references(() => themes.id),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url").notNull(),
  originalPrompt: text("original_prompt").notNull(),
  generationTime: integer("generation_time"), // in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const babyTransforms = pgTable("baby_transforms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalImageUrl: text("original_image_url").notNull(),
  transformedImageUrl: text("transformed_image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const themesRelations = relations(themes, ({ many }) => ({
  generatedImages: many(generatedImages),
}));

export const usersRelations = relations(users, ({ many }) => ({
  generatedImages: many(generatedImages),
  babyTransforms: many(babyTransforms),
}));

export const generatedImagesRelations = relations(generatedImages, ({ one }) => ({
  theme: one(themes, {
    fields: [generatedImages.themeId],
    references: [themes.id],
  }),
  user: one(users, {
    fields: [generatedImages.userId],
    references: [users.id],
  }),
}));

export const babyTransformsRelations = relations(babyTransforms, ({ one }) => ({
  user: one(users, {
    fields: [babyTransforms.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertThemeSchema = createInsertSchema(themes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
});

export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({
  id: true,
  createdAt: true,
});

export const insertBabyTransformSchema = createInsertSchema(babyTransforms).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Theme = typeof themes.$inferSelect;
export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type BabyTransform = typeof babyTransforms.$inferSelect;
export type InsertBabyTransform = z.infer<typeof insertBabyTransformSchema>;
