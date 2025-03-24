import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatWithAI } from "./openai";
import { insertCitySchema, insertPlaceSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // Get all tags
  app.get("/api/tags", async (req: Request, res: Response) => {
    const tags = await storage.getTags();
    res.json(tags);
  });

  // Get all cities
  app.get("/api/cities", async (req: Request, res: Response) => {
    const cities = await storage.getCities();
    res.json(cities);
  });

  // Get featured cities
  app.get("/api/cities/featured", async (req: Request, res: Response) => {
    const cities = await storage.getFeaturedCities();
    res.json(cities);
  });

  // Get city by ID
  app.get("/api/cities/:id", async (req: Request, res: Response) => {
    const cityId = parseInt(req.params.id);
    if (isNaN(cityId)) {
      return res.status(400).json({ message: "Invalid city ID" });
    }

    const city = await storage.getCity(cityId);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(city);
  });

  // Create a new city
  app.post("/api/cities", async (req: Request, res: Response) => {
    try {
      const cityData = insertCitySchema.parse(req.body);
      const newCity = await storage.createCity(cityData);
      res.status(201).json(newCity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid city data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create city" });
    }
  });

  // Get all places
  app.get("/api/places", async (req: Request, res: Response) => {
    const places = await storage.getPlaces();
    res.json(places);
  });

  // Get featured places
  app.get("/api/places/featured", async (req: Request, res: Response) => {
    const places = await storage.getFeaturedPlaces();
    res.json(places);
  });

  // Get places by city
  app.get("/api/cities/:id/places", async (req: Request, res: Response) => {
    const cityId = parseInt(req.params.id);
    if (isNaN(cityId)) {
      return res.status(400).json({ message: "Invalid city ID" });
    }

    const city = await storage.getCity(cityId);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const places = await storage.getPlacesByCity(cityId);
    res.json(places);
  });

  // Get place by ID
  app.get("/api/places/:id", async (req: Request, res: Response) => {
    const placeId = parseInt(req.params.id);
    if (isNaN(placeId)) {
      return res.status(400).json({ message: "Invalid place ID" });
    }

    const place = await storage.getPlace(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json(place);
  });

  // Create a new place
  app.post("/api/places", async (req: Request, res: Response) => {
    try {
      const placeData = insertPlaceSchema.parse(req.body);
      const newPlace = await storage.createPlace(placeData);
      res.status(201).json(newPlace);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid place data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create place" });
    }
  });

  // Get reviews for a place
  app.get("/api/places/:id/reviews", async (req: Request, res: Response) => {
    const placeId = parseInt(req.params.id);
    if (isNaN(placeId)) {
      return res.status(400).json({ message: "Invalid place ID" });
    }

    const place = await storage.getPlace(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const reviews = await storage.getReviews(placeId);
    res.json(reviews);
  });

  // Create a review for a place
  app.post("/api/places/:id/reviews", async (req: Request, res: Response) => {
    const placeId = parseInt(req.params.id);
    if (isNaN(placeId)) {
      return res.status(400).json({ message: "Invalid place ID" });
    }

    const place = await storage.getPlace(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        placeId
      });
      
      const newReview = await storage.createReview(reviewData);
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid review data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Chat with AI about a place
  app.post("/api/places/:id/chat", async (req: Request, res: Response) => {
    const placeId = parseInt(req.params.id);
    if (isNaN(placeId)) {
      return res.status(400).json({ message: "Invalid place ID" });
    }

    const place = await storage.getPlace(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const schema = z.object({
      message: z.string().min(1),
      history: z.array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string()
        })
      ).optional()
    });

    try {
      const { message, history } = schema.parse(req.body);
      const city = await storage.getCity(place.cityId);
      
      const response = await chatWithAI(message, place, city?.name || "", history || []);
      res.json({ response });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid chat request", 
          errors: error.errors 
        });
      }
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: "Failed to process chat request", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
