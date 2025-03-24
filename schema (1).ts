import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = [
  "Ristoranti",
  "Bar",
  "Musei",
  "Palestre",
  "Piscine",
  "Hotel",
  "Altri"
];

export const tags = [
  "Economico",
  "Romantico", 
  "Terrazza",
  "Centro storico",
  "Pet-friendly",
  "Wi-Fi gratis",
  "Vista panoramica",
  "Fine Dining",
  "Cucina Italiana",
  "Arte",
  "Rinascimento",
  "Lusso"
];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").default(false),
});

export const places = pgTable("places", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  cityId: integer("city_id").notNull(),
  category: text("category").notNull(),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  priceLevel: text("price_level").default("$$"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  openingHours: text("opening_hours"),
  tags: text("tags").array(),
  images: text("images").array(),
  isFeatured: boolean("is_featured").default(false),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id").notNull(),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCitySchema = createInsertSchema(cities).pick({
  name: true,
  country: true,
  description: true,
  imageUrl: true,
  isFeatured: true,
});

export const insertPlaceSchema = createInsertSchema(places).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

export type InsertPlace = z.infer<typeof insertPlaceSchema>;
export type Place = typeof places.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
