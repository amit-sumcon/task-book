import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokenHandler";
import { APIError } from "../utils/APIError";
import { CustomRequest } from "../types/types";

export const authenticateToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

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
