import { z } from "zod";

export const registrationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    phoneNumber: z
        .string()
        .min(10, "Invalid phone number")
        .max(10, "Invalid phone number")
        .optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(6, "Password must be atleast 6 characters")
        .max(12, "Password must be less than 12 characters!"),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z.string().min(6, "Password must be atleast 6 characters").optional(),
    phoneNumber: z
        .string()
        .min(10, "Invalid phone number")
        .max(10, "Invalid phone number")
        .optional(),
});
