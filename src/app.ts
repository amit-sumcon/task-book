import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import redisClient from "./config/redis";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import useragent from "express-useragent";
import logger from "./config/logger";

const app: Application = express();

// Connect Redis Client and handle errors
redisClient.connect().catch((error: Error) => {
    logger.error("Failed to connect to Redis:", error);
});

// Setup CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// Set up rate limiting using Redis
const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(useragent.express());

// Declare routes
app.get("/health", (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            status: "UP",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            name: "Taskbook",
            version: "1.0.0",
            description: "This will provide all task related to services",
            author: "Amit Kandar",
            status: "Running",
        });
    } catch (error) {
        next(error);
    }
});

// Import all routes
import userRoute from "./routes/user.route";
import taskRoute from "./routes/task.route";

// Declare all routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/tasks", taskRoute);

// Error handler
app.use(errorHandler);

export { app };
