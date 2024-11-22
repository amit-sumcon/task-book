import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/types";
import { asyncHandler } from "../utils/asyncHandler";
import { APIError } from "../utils/APIError";
import { assignTaskSchema, getTaskSchema, updateTaskSchema } from "../schema/task.schema";
import prisma from "../database/prismaClient";
import { generateTaskId } from "../utils/generateTaskId";
import { APIResponse } from "../utils/APIResponse";
import { calculateNextDate } from "../utils/calculateNextDate";
import logger from "../config/logger";

// Assign new task";
export const assignTask = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: Extract task assignment details from the request body
            const { planned, name, freq, department, doerEmail, doerName } = req.body;

            // Step 2: Get the email of the assigning user (from `req.user`)
            const user = req.user;
            if (!user) {
                throw new APIError(403, "Unauthorized request, please login again");
            }

            // Step 3: Validate input using Zod schema
            const { success, data, error } = assignTaskSchema.safeParse({
                name,
                planned,
                freq,
                department,
                doerEmail,
                doerName,
            });

            if (!success) {
                // Extract and return validation errors
                const errorMessages = error.errors.map((err) => err.message);
                throw new APIError(400, "Invalid input", errorMessages);
            }

            const taskCode = await generateTaskId(data.department);

            // Step 6: Update the task with assignment details
            const updatedTask = await prisma.task.create({
                data: {
                    taskCode: taskCode,
                    assignedBy: user.email,
                    department: data.department,
                    doerEmail: doerEmail,
                    doerName: doerName,
                    freq: data.freq,
                    name: data.name,
                    planned: new Date(data.planned),
                    updatedBy: user.email,
                },
            });

            // Step 7: Respond with success
            res.status(200).json(
                new APIResponse(200, updatedTask, "Task assigned successfully")
            );
        } catch (error) {
            next(error);
        }
    }
);

export const getAllTasks = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const tasks = await prisma.task.findMany();
            res.status(200).json(
                new APIResponse(200, tasks, "Fetched all tasks successfully")
            );
        } catch (error) {
            next(error);
        }
    }
);

export const getUserTasks = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { doerEmail } = req.query;

            const { success, data, error } = getTaskSchema.safeParse({
                doerEmail: doerEmail,
            });
            if (!success) {
                // Extract and return validation errors
                const errorMessages = error.errors.map((err) => err.message);
                throw new APIError(400, "Invalid input", errorMessages);
            }

            const tasks = await prisma.task.findMany({
                where: {
                    doerEmail: data.doerEmail,
                },
            });
            res.status(200).json(
                new APIResponse(200, tasks, `Tasks for ${doerEmail} fetched successfully`)
            );
        } catch (error) {
            next(error);
        }
    }
);

export const getTaskByCode = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const taskId = parseInt(req.params.taskId, 10);
            const task = await prisma.task.findUnique({
                where: {
                    id: taskId,
                },
            });

            if (!task) {
                throw new APIError(404, "Task not found");
            }

            res.status(200).json(
                new APIResponse(
                    200,
                    task,
                    `Task with code ${taskId} fetched successfully`
                )
            );
        } catch (error) {
            next(error);
        }
    }
);

export const updateTask = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Parse and validate taskId
            const taskId = parseInt(req.params.taskId, 10);
            if (isNaN(taskId)) {
                throw new APIError(400, "Invalid taskId. It should be a number.");
            }

            const { name, freq, department, doerEmail, doerName } = req.body;
            const user = req.user; // Assuming req.user is populated by auth middleware

            if (!user) {
                throw new APIError(403, "Unauthorized request, please login again.");
            }

            // Get the task to update
            const task = await prisma.task.findUnique({
                where: { id: taskId },
            });

            if (!task) {
                throw new APIError(404, "Task not found.");
            }

            // Validate input using Zod schema
            const { success, data, error } = updateTaskSchema.safeParse({
                name,
                freq,
                department,
                doerName,
                doerEmail,
            });

            if (!success) {
                const errorMessages = error.errors.map((err) => err.message);
                throw new APIError(400, "Invalid input", errorMessages);
            }

            // Update the task
            const updatedTask = await prisma.task.update({
                where: { id: taskId },
                data: {
                    name: data.name,
                    freq: data.freq,
                    department: data.department,
                    doerEmail: data.doerEmail,
                    doerName: data.doerName,
                    updatedBy: user.email,
                },
            });

            // Respond with the updated task
            res.status(200).json(
                new APIResponse(200, updatedTask, "Task updated successfully.")
            );
        } catch (error) {
            next(error);
        }
    }
);

// This function is not working
export const getSortedTasks = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { sortBy } = req.query;

            // Mapping the sortBy query to the actual Prisma sorting options
            const sortMap: { [key: string]: any } = {
                status: { status: true },
                name: { name: "asc" },
                date: { planned: "asc" },
            };

            // Use the mapped sort option or an empty object for default
            const sortOptions = sortMap[sortBy as string] || {};

            // Fetch tasks with the appropriate sorting
            const tasks = await prisma.task.findMany({
                orderBy: sortOptions,
            });

            res.status(200).json(
                new APIResponse(200, tasks, "Sorted tasks fetched successfully")
            );
        } catch (error) {
            next(error);
        }
    }
);

export const updateTaskStatus = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const taskId = parseInt(req.params.taskId, 10);

            // Check if taskId is a valid number
            if (isNaN(taskId) || taskId <= 0) {
                throw new APIError(
                    400,
                    "Invalid taskId. It should be a positive number."
                );
            }

            const { status } = req.body;

            // Validate the status field
            if (status === undefined || status === null) {
                throw new APIError(400, "Status is required.");
            }

            // Fetch the task to ensure it exists
            const task = await prisma.task.findUnique({
                where: {
                    id: taskId,
                },
            });

            if (!task) {
                throw new APIError(404, "Task not found.");
            }

            // Check if the status is already set
            if (task.status === status) {
                throw new APIError(400, "The task already has the specified status.");
            }

            // Update the task's status
            const updatedTask = await prisma.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    status: status,
                    actual: new Date().toISOString(),
                },
            });

            res.status(200).json(
                new APIResponse(200, updatedTask, "Task status updated successfully.")
            );
        } catch (error) {
            next(error);
        }
    }
);

export const reassignTask = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentDate = new Date(Date.now());
            logger.info(currentDate);

            // Fetch tasks that are due today or in the past
            const tasksToReassign = await prisma.task.findMany({
                where: {
                    planned: {
                        lte: currentDate, // Tasks that are due today or earlier
                    },
                },
            });

            if (tasksToReassign.length === 0) {
                res.status(200).json(new APIResponse(200, [], "No tasks to reassign"));
                return;
            }

            const createdTasks = [];

            // Loop through the tasks and reassign based on frequency
            for (const task of tasksToReassign) {
                const { freq, planned, taskCode, department, doerEmail, doerName, name } =
                    task;

                // Use the calculateNextDate function to determine the next planned date based on frequency
                const nextPlannedDate = calculateNextDate(freq, new Date(planned));

                // Create the new task with the updated planned date
                const newTask = await prisma.task.create({
                    data: {
                        taskCode: taskCode,
                        assignedBy: task.updatedBy,
                        department: department,
                        doerEmail: doerEmail,
                        doerName: doerName,
                        freq: freq,
                        name: name,
                        planned: nextPlannedDate,
                        updatedBy: task.updatedBy,
                    },
                });
                createdTasks.push(newTask);
            }

            res.status(200).json(
                new APIResponse(200, createdTasks, "Tasks reassigned successfully")
            );
        } catch (error) {
            next(error);
        }
    }
);
