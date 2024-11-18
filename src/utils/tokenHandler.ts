import jwt from "jsonwebtoken";
import logger from "../config/logger";
import { TokenPayload } from "../types/token";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (payload: object): string => {
    if (!ACCESS_TOKEN_SECRET) return "Access token secret cannot found";
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (payload: object): string => {
    if (!REFRESH_TOKEN_SECRET) return "Refresh token secret cannot found";
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Long-lived refresh token
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        if (!ACCESS_TOKEN_SECRET) return null;
        // Verify the token and ensure it's a JwtPayload
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
        return typeof payload === "object" && payload !== null
            ? (payload as TokenPayload)
            : null;
    } catch (err) {
        logger.info("Access Token Verification Failed:", err);
        return null;
    }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        if (!REFRESH_TOKEN_SECRET) return null;
        const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);

        // Validate and cast the payload to TokenPayload
        if (
            typeof payload === "object" &&
            payload !== null &&
            "id" in payload &&
            "email" in payload
        ) {
            return payload as TokenPayload;
        }
        return null; // Payload doesn't match the expected structure.
    } catch (err) {
        logger.info("Refresh Token Verification Failed:", err);
        return null;
    }
};
