import express from "express";
import cors from "cors";
import { ApiError } from "./errors.js";
import { seedData } from "./store/seed.js";
import moviesRouter from "./routes/movies.js";
import cinemasRouter from "./routes/cinemas.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/movies", moviesRouter);
  app.use("/api/cinemas", cinemasRouter);

  // Unknown route
  app.use((_req, res) => {
    res.status(404).json({ error: "NOT_FOUND", message: "Route not found" });
  });

  // Error handler
  app.use((err, _req, res, _next) => {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ error: err.code, message: err.message });
    }
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "VALIDATION_ERROR", message: "Invalid JSON body" });
    }
    console.error(err);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Something went wrong" });
  });

  return app;
}

// Vercel entry: Vercel src/app.js er default export ke request handler hisebe chalay.
// Prothom request e ekbar seed kore app banay. Tests ar local (src/index.js) e eta use hoy na.
let vercelApp;
export default function handler(req, res) {
  if (!vercelApp) {
    seedData();
    vercelApp = createApp();
  }
  return vercelApp(req, res);
}