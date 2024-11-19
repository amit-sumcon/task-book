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
    "E4TH",
    "ELAST",
] as const;

export const createTaskSchema = z.object({
    name: z.string().min(3, "Name is required"),
    description: z.string().min(3, "Description is required"),
    frequency: z.enum(frequencyEnum),
    dependencies: z.array(z.string()).optional(),
    department: z.enum(DepartmentEnum),
});

export const updateTaskSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    description: z
        .string()
        .min(3, "Description must be at least 3 characters")
        .optional(),
    frequency: z.enum(frequencyEnum).optional(),
    dependencies: z.array(z.string()).optional(),
    department: z.enum(DepartmentEnum).optional(),
});
