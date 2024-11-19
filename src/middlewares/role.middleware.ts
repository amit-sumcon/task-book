import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/types";
import { APIError } from "../utils/APIError";

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            throw new APIError(403, "Access denied. Insufficient permissions.");
        }
        next();
    };
};
