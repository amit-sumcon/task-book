import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokenHandler";
import { APIError } from "../utils/APIError";
import { CustomRequest } from "../types/types";

export const authenticateToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers["authorization"]?.split(" ")[1] || req.cookies.accessToken;

    if (!token) {
        throw new APIError(401, "Unauthorized");
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
        throw new APIError(403, "Forbidden");
    }

    req.user = payload;
    next();
};
