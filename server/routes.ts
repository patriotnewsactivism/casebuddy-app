import type { Express } from "express";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { LegalAnalyticsService } from "./legal-analytics";
import authRoutes from "./auth-routes";
import { optionalAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware
  app.use(cookieParser());
  app.use(optionalAuth);

  // Authentication routes
  app.use("/api/auth", authRoutes);

  // This endpoint is used to serve public assets.
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // This endpoint is used to serve private objects that can be accessed publicly
  // (i.e.: without authentication and ACL check).
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // This endpoint is used to get the upload URL for an object entity.
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // An example endpoint for updating the model state after an object entity is uploaded (document in this case).
  app.put("/api/documents", async (req, res) => {
    if (!req.body.documentURL) {
      return res.status(400).json({ error: "documentURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(
        req.body.documentURL,
      );

      // In a real implementation, you would save this to the database
      // For now, we'll just return the normalized path
      res.status(200).json({
        objectPath: objectPath,
        success: true,
      });
    } catch (error) {
      console.error("Error processing document upload:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Legal Analytics API Routes
  app.post("/api/legal-analytics/predict-outcome", LegalAnalyticsService.predictCaseOutcome);
  app.post("/api/legal-analytics/judge-analytics", LegalAnalyticsService.analyzeJudge);
  app.post("/api/legal-analytics/find-precedents", LegalAnalyticsService.findRelevantPrecedents);
  app.post("/api/legal-analytics/strategy-recommendations", LegalAnalyticsService.generateStrategyRecommendations);
  app.post("/api/legal-analytics/analyze-evidence", LegalAnalyticsService.analyzeEvidence);
  app.post("/api/legal-analytics/similar-cases", LegalAnalyticsService.findSimilarCases);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      service: "Case Intelligence Portal API"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
