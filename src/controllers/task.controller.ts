import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/types";
import { asyncHandler } from "../utils/asyncHandler";
import { APIError } from "../utils/APIError";
import { createTaskSchema, updateTaskSchema } from "../schema/task.schema";
import prisma from "../database/prismaClient";
import { generateTaskId } from "../utils/generateTaskId";
import { APIResponse } from "../utils/APIResponse";

// Create a new task
export const createTask = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Get task details from body
            const { name, description, frequency, dependencies, department } = req.body;

            // Step 2: Get user from req.user
            const user = req.user;
            if (!user) {
                throw new APIError(403, "Unauthorized request, login again");
            }

            // Step 3: Validate task details
            const { success, data, error } = createTaskSchema.safeParse({
                name,
                description,
                frequency,
                dependencies,
                department,
            });
            if (!success) {
                // Extract error messages
                const errorMessages = error.errors.map((err) => err.message);

                // Throw APIError with error details
                throw new APIError(400, "Invalid input", errorMessages);
            }

            // Step 4: Check if the task exists or not
            const isExist = await prisma.taskDetail.findUnique({
                where: {
                    name: data.name,
                    department: data.department,
                },
            });
            if (isExist) {
                throw new APIError(409, "Task already exists with the same name");
            }

            const taskCode = await generateTaskId(data.department);

            // Step 5: Create new task
            const task = await prisma.taskDetail.create({
                data: {
                    taskCode: taskCode,
                    name: data.name,
                    description: data.description,
                    frequency: data.frequency,
                    dependencies: data.dependencies,
                    department: data.department,
                    createdBy: user.email,
                    updatedBy: user.email,
                },
            });

            // Step 6: Send back the response
            res.status(201).json(new APIResponse(201, task, "Task created successfully"));
        } catch (error) {
            next(error);
        }
    }
);

// Get task by task code
export const getTaskByTaskCode = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Get the task code from params
            const taskCode = req.params.taskCode;

            // Step 2: Retrive the task by taskCode from the database
            const task = await prisma.taskDetail.findUnique({
                where: {
                    taskCode: taskCode,
                },
            });

            // Step 3: Send the response back to the user
            res.status(200).json(
                new APIResponse(200, task, "Task retrived successfully")
            );
        } catch (error) {
            next(error);
        }
    }
);

// Update task
export const updateTask = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Get task details from the body
            const { name, description, department, frequency } = req.body;

            // Step 2: Get task code from params
            const taskCode = req.params.taskCode;

            // Step 3: Validate task details
            const { success, data, error } = updateTaskSchema.safeParse({
                name,
                description,
                department,
                frequency,
            });
            if (!success) {
                // Extract error messages
                const errorMessages = error.errors.map((err) => err.message);

                // Throw APIError with error details
                throw new APIError(400, "Invalid input", errorMessages);
            }

            // Step 4: Get user from the req.user
            const user = req.user;
            if (!user) {
                throw new APIError(403, "Unauthorized request, login again");
            }

            // Step 6: Retrive the task using taskCode from database
            const task = await prisma.taskDetail.findUnique({
                where: {
                    taskCode: taskCode,
                },
            });

            // Step 7: Validate if the task is exists or not
            if (!task) {
                throw new APIError(404, "Task not found with the task code");
            }

            // Step 8: Check if the data is already exists or not
            if (
                data.department === task.department ||
                data.description === task.description ||
                data.name === task.name ||
                data.frequency === task.frequency
            ) {
                throw new APIError(400, "Data is already exists in the database");
            }

            // Step 9: Update the data in database
            await prisma.taskDetail.update({
                where: {
                    taskCode: taskCode,
                },
                data: {
                    ...data,
                    updatedBy: user.email,
                },
            });

            const updatedTask = await prisma.taskDetail.findUnique({
                where: { taskCode: taskCode },
            });

            // Step 10: Send the response back to the user
            res.status(200).json(
                new APIResponse(200, { ...updatedTask }, "Task updated successfully")
            );
        } catch (error) {
            next(error);
        }
    }
);

// Delete the Task
export const deleteTask = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Get task code from params
            const taskCode = req.params.taskCode;

            // Step 2: Delete the task using taskCode from the database
            const task = await prisma.taskDetail.findUnique({
                where: {
                    taskCode: taskCode,
                },
            });

            // Step 3: Validate if the task is exists or not
            if (!task) {
                throw new APIError(404, "Task not found with the task code");
            }

            // Step 4: Delete the task from the database
            await prisma.taskDetail.delete({
                where: {
                    taskCode: taskCode,
                },
            });

            // Step 5: Send the response back to the user
            res.status(200).json(
                new APIResponse(200, {}, "Successfully deleted the task")
            );
        } catch (error) {
            next(error);
        }
    }
);

// Get all tasks
export const getAllTasks = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Retrive all tasks
            const tasks = await prisma.taskDetail.findMany();
            // Step 2: Validate the result
            if (!tasks) {
                throw new APIError(400, "Unable to fetch the tasks");
            }

            // Step 3: Send back the task
            res.status(200).json(
                new APIResponse(200, tasks, "Successfully fetch the tasks")
            );
        } catch (error) {
            next(error);
        }
    }
);
