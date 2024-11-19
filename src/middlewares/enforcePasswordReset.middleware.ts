import { NextFunction, Response } from "express";
import prisma from "../database/prismaClient";
import { CustomRequest } from "../types/types";
import { APIError } from "../utils/APIError";
import { asyncHandler } from "../utils/asyncHandler";

export const enforcePasswordReset = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new APIError(404, "User not found");
        }

        if (user.forcePasswordReset) {
            throw new APIError(403, "Password reset required.");
        }

        next();
    }
);
