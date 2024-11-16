import * as redis from "redis";
import logger from "./logger";
import appConfig from "./app.config";

const REDIS_HOST =
    appConfig.REDIS_HOST ||
    `${appConfig.NODE_ENV === "production" ? "redis" : "localhost"}`;
const REDIS_PORT = appConfig.REDIS_PORT || 6379;

const redisURL = `redis://${REDIS_HOST}:${REDIS_PORT}`;

// Redis client configuration
const redisClient = redis.createClient({
    url: redisURL,
});

redisClient.on("connect", () => {
    logger.info(`Connected to Redis with ${redisURL}`);
});

redisClient.on("error", (err) => {
    logger.error("Redis error:", err);
});

export default redisClient;
