import { NextFunction, Response } from "express";
import { APIResponse } from "../utils/APIResponse";
import prisma from "../database/prismaClient";
import {
    loginSchema,
    registerSuperAdminSchema,
    registrationSchema,
    updateRoleSchema,
    updateUserSchema,
} from "../schema/userSchema";
import { APIError } from "../utils/APIError";
import { generateUniqueUsernameFromName } from "../utils/generateUsername";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler";
import { UploadApiResponse } from "cloudinary";
import { uploadToCloudinary } from "../utils/cloudinary";
import { createImageWithInitials } from "../utils/createImage";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/tokenHandler";
import { CustomRequest } from "../types/types";
import { TokenPayload } from "../types/token";

// Create user function
export const register = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
        // Step 1: Get the data from body
        const { name, email, phoneNumber, password } = req.body;

        // Step 2: Get ip address and device info

        // Use both this later on for more security on device like which device and which ip address
        // const ipAddress = req.headers["x-forwarded-for"] || req.ip;
        // const deviceInfo = `${req.useragent?.platform} ${req.useragent?.os} - ${req.useragent?.browser}`;

        // Step 3: Validate the data
        const { data, success } = registrationSchema.safeParse({
            name,
            email,
            phoneNumber,
            password,
        });
        if (!success) {
            throw new APIError(400, "Invalid input");
        }

        // Step 4: Check user exist or not
        const isExist = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        // Step 5: If exists send response with an error
        if (isExist) {
            throw new APIError(400, "User already exists!");
        }

        // Step 6: Generate username
        const username = await generateUniqueUsernameFromName(data.name);

        // Step 7: Hash the password
        const hash_password = await bcrypt.hash(data.password, 10);

        let avatarLocalPath: string;
        const path = req.file?.path;

        if (!path) {
            avatarLocalPath = await createImageWithInitials(name);
        } else {
            avatarLocalPath = path;
        }

        const avatar: UploadApiResponse | string = await uploadToCloudinary(
            avatarLocalPath,
            "users"
        );

        if (
            typeof avatar !== "object" ||
            !avatar.hasOwnProperty("url") ||
            !avatar.hasOwnProperty("public_id")
        )
            throw new APIError(400, "Invalid Cloudinary Response");

        const { url: avatarURL, public_id } = avatar as UploadApiResponse;

        // Step 8: Send email for welcome and verification
        // Step 9: Store the data into the database
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                username,
                phoneNumber: data.phoneNumber,
                password: hash_password,
                avatarUrl: avatarURL,
                avatarPublicId: public_id,
            },
        });

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        // Optionally store the refresh token in the database if needed
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        // Step 11: Send the response
        res.status(201)
            .cookie("accessToken", accessToken, { secure: true, httpOnly: true })
            .json(
                new APIResponse(
                    201,
                    { ...user, accessToken, refreshToken },
                    "Successfully created user"
                )
            );
    }
);

// User login function
export const login = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
        // Step 1: Get the data from body
        const { email, password } = req.body;

        // Step 2: Validate the data
        const { data, error } = loginSchema.safeParse({ email, password });
        if (error) {
            throw new APIError(400, "Invalid input");
        }

        // Step 3: Check user exists or not using email
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        // Step 4: If exists send response with an error
        if (!user) {
            throw new APIError(400, "Email does not exists");
        }

        // Step 5: Compare password with the existing hash
        const isCorrectPassword = bcrypt.compareSync(password, user.password);

        // Step 6: If password doesn't match throw error
        if (!isCorrectPassword) {
            throw new APIError(400, "Incorrect password");
        }

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        // Optionally store the refresh token in the database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        // Step 7: Send Response for successfull login
        res.status(200)
            .cookie("accessToken", accessToken, { secure: true, httpOnly: true })
            .json(
                new APIResponse(
                    200,
                    { accessToken, refreshToken },
                    "Successfully Logged In"
                )
            );
    }
);

// User logout function
export const logout = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Get user from req.user
            const user = req.user;

            // Step 2: Validate the user
            if (!user) {
                throw new APIError(403, "Unauthorize request, login again");
            }

            // Step 3: Remove accessToken cookie, Send back response to user
            res.status(200)
                .clearCookie("accessToken", { secure: true, httpOnly: true })
                .json(new APIResponse(200, {}, "User logout successfully"));
        } catch (error) {
            next(error);
        }
    }
);

// Get a user by id
export const getUserById = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
        // Step 1: Get user id from params
        const user_id = req.params.id;

        // Step 2: Validate the id
        // if (!Number.isInteger(user_id)) {
        //     throw new APIError(400, "Invalid user id", [], user_id);
        // }

        // Step 3: Retrive the user from database by id
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });

        // Step 4: Check for successfull retrive
        if (!user) {
            throw new APIError(404, "User not found");
        }

        // Step 5: Send back the response
        res.status(200).json(new APIResponse(200, user, "Successfully retrive the user"));
    }
);

// Get all user function
export const getAllUser = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
        // Step 1: Retrive the user from database by id
        const user = await prisma.user.findMany();

        // Step 2: Check for successfull retrive
        if (!user) {
            throw new APIError(404, "User not found");
        }

        // Step 3: Send back the response
        res.status(200).json(
            new APIResponse(200, user, "Successfully retrive all the user")
        );
    }
);

// Update the user by id
export const updateUser = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
        // Step 1: Get the user id from params
        const user_id = req.params.id;

        // Step 2: Get data from body
        const { name, email, phoneNumber } = req.body;

        // Step 3: Validate the user id
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!user) {
            throw new APIError(400, "Invalid user id");
        }

        // Step 4: Validate the data
        const { data, error } = updateUserSchema.safeParse({ name, email, phoneNumber });
        if (error) {
            // Extract the error details
            const errors = error.errors.map((e) => e.message);
            throw new APIError(400, "Invalid Input", errors);
        }

        // Step 5: Check if the data is already exists in the database or not
        if (
            user.email === data.email ||
            user.name === data.name ||
            user.phoneNumber === data.phoneNumber
        ) {
            throw new APIError(400, "Data is already exists in the database");
        }

        // Step 6: Save data into database
        await prisma.user.update({
            where: {
                id: user_id,
            },
            data: data,
        });

        const updatedUser = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });

        // Step 7: Send back the response
        res.status(200).json(new APIResponse(200, updatedUser, "Successfully updated"));
    }
);

// Delete the user
export const deleteUser = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
        // Step 1: Get the user id from params
        const user_id = req.params.id;

        // Step 2: Get the user from database
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });

        // Step 3: If the user not exist throw error
        if (!user) {
            throw new APIError(404, "User doesn't exist");
        }

        // Step 4: Delete the user from database
        await prisma.user.delete({
            where: {
                id: user.id,
            },
        });

        // Step 5: Send the response
        res.status(200).json(new APIResponse(200, {}, "Successfully deleted user"));
    }
);

export const refreshToken = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new APIError(400, "Refresh token is required");
        }

        const payload: TokenPayload | null = verifyRefreshToken(refreshToken);
        if (!payload) {
            throw new APIError(403, "Invalid refresh token");
        }

        // Optionally check the refresh token against the database
        const user = await prisma.user.findUnique({
            where: { id: payload?.id, refreshToken: refreshToken },
        });
        if (!user) {
            throw new APIError(403, "Invalid refresh token");
        }

        // Generate new tokens
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email });

        // Update the refresh token in the database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });

        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    }
);

export const registerSuperAdmin = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Get data(name, email, phoneNumber, role, password) from the req
            const { name, email, password, phoneNumber, role } = req.body;

            // Step 2: Validate the input data
            const { data, success, error } = registerSuperAdminSchema.safeParse({
                name,
                email,
                password,
                phoneNumber,
                role,
            });
            if (!success) {
                // Extract error messages
                const errorMessages = error.errors.map((err) => err.message);

                // Throw APIError with error details
                throw new APIError(400, "Invalid input", errorMessages);
            }

            // Step 3: Check is there any super admin
            const superAdmin = await prisma.user.findUnique({
                where: { role: role, email: data.email },
            });
            if (superAdmin) {
                throw new APIError(
                    409,
                    `Super admin already exists with this email ${data.email}`
                );
            }

            // Step 4: Generate username
            const username = await generateUniqueUsernameFromName(data.name);

            // Step 5: Hash the password
            const hash_password = await bcrypt.hash(data.password, 10);

            let avatarLocalPath: string;
            const path = req.file?.path;

            if (!path) {
                avatarLocalPath = await createImageWithInitials(data.name);
            } else {
                avatarLocalPath = path;
            }

            const avatar: UploadApiResponse | string = await uploadToCloudinary(
                avatarLocalPath,
                "users"
            );

            if (
                typeof avatar !== "object" ||
                !avatar.hasOwnProperty("url") ||
                !avatar.hasOwnProperty("public_id")
            )
                throw new APIError(400, "Invalid Cloudinary Response");

            const { url: avatarURL, public_id } = avatar as UploadApiResponse;

            // Step 6: Send email for welcome and verification
            // Step 7: Store the data into the database
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    username,
                    phoneNumber: data.phoneNumber,
                    password: hash_password,
                    avatarUrl: avatarURL,
                    avatarPublicId: public_id,
                    role: data.role,
                },
            });

            const accessToken = generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            const refreshToken = generateRefreshToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            // Optionally store the refresh token in the database if needed
            await prisma.user.update({
                where: { id: user.id },
                data: { refreshToken },
            });

            // Step 11: Send the response
            res.status(201)
                .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
                .json(
                    new APIResponse(
                        201,
                        { ...user, accessToken, refreshToken },
                        "Successfully created super admin"
                    )
                );
        } catch (error) {
            next(error);
        }
    }
);

export const updateRole = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Get the data from body
            const { role, email } = req.body;

            // Step 2: Get user from req.user
            const user = req.user;

            // Step 3: Validate user role
            if (!user) {
                throw new APIError(403, "Access denied.Insufficient permissions.");
            }

            // Step 4: Validate req.body data
            const { data, success, error } = updateRoleSchema.safeParse({
                role,
                email,
            });
            if (!success) {
                // Extract error messages
                const errorMessages = error.errors.map((err) => err.message);

                // Throw APIError with error details
                throw new APIError(400, "Invalid input", errorMessages);
            }

            // Step 5: Update role, based on user role
            if (user.role === "SUPER_ADMIN") {
                await prisma.user.update({
                    where: {
                        email: data.email,
                    },
                    data: {
                        role: role,
                    },
                });
            }
            if (user.role === "ADMIN") {
                if (role === "SUPER_ADMIN") {
                    throw new APIError(
                        403,
                        "Admins do not have sufficient permissions to assign the SUPER_ADMIN role."
                    );
                }
                await prisma.user.update({
                    where: {
                        email: data.email,
                    },
                    data: {
                        role: role,
                    },
                });
            }

            // Step 7: Send response to the user
            res.status(200).json(new APIResponse(200, "User role updated"));
        } catch (error) {
            next(error);
        }
    }
);
