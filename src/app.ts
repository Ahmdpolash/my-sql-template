import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// parsers

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: true, // Allow all origins for debugging
    credentials: true,
  })
);

// app routes
app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.render("index.ejs");
});

// Health check endpoint for Docker
app.get("/health", async (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
