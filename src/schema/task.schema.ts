import { z } from "zod";

// Define the department enum
const DepartmentEnum = [
    "ACCOUNTS",
    "MDO",
    "S_T",
    "PM",
    "MD",
    "MANAGER_HO",
    "COORDINATOR_HO",
    "OHE",
    "MARKETING_TENDER",
    "HR",
    "CA",
    "BILLING_ENGINEER",
    "SURVEYER_DEPARTMENT",
    "OTHERS",
    "OFFICE_EXECUTIVES",
    "PURCHASE",
    "QC_ENGINEER",
] as const;

const frequencyEnum = [
    "D",
    "W",
    "M",
    "Y",
    "Q",
    "F",
    "E1ST",
    "E2ND",
    "E3RD",
    "ELAST",
] as const;

export const assignTaskSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    planned: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Planned date must be in YYYY-MM-DD format")
        .refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime()); // Ensure it's a valid date
        }, "Planned date must be a valid calendar date"),
    department: z.enum(DepartmentEnum),
    freq: z.enum(frequencyEnum),
    doerEmail: z.string().email("Invalid email"),
    doerName: z.string().min(3, "Doer name must be at least 3 characters"),
});

export const getTaskSchema = z.object({
    doerEmail: z.string().email("Invalid email"),
});

export const updateTaskSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    department: z.enum(DepartmentEnum).optional(),
    freq: z.enum(frequencyEnum).optional(),
    doerEmail: z.string().email("Invalid email").optional(),
    doerName: z.string().min(3, "Doer name must be at least 3 characters").optional(),
});
