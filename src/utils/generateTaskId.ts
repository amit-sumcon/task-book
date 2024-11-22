import logger from "../config/logger";
import prisma from "../database/prismaClient";
import { APIError } from "./APIError";

export const generateTaskId = async (department: string): Promise<string> => {
    // Extract a meaningful department code
    const extractDepartmentCode = (dept: string): string => {
        const words = dept
            .trim()
            .split(/[\s_]+/) // Split by spaces or underscores
            .filter(Boolean); // Remove empty strings

        if (words.length === 1) {
            // If there's only one word, take the first two characters
            return words[0].substring(0, 2).toUpperCase();
        }

        // If there are multiple words, take the first character of each word
        return words.map((word) => word[0].toUpperCase()).join("");
    };

    // Clean up the department and extract the code
    const departmentCode = extractDepartmentCode(department);

    const maxRetries = 5; // Set a maximum number of retries
    let taskId: string;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        // Generate a 6-digit random number
        const randomId = Math.floor(Math.random() * 900000) + 100000;

        // Construct the task ID
        taskId = `${departmentCode}-${randomId}`;

        // Check if the taskId already exists in the database
        const taskExists = await prisma.task.findFirst({
            where: { taskCode: taskId },
        });

        if (!taskExists) {
            // If task ID doesn't exist, return the unique ID
            return taskId;
        }

        // If it exists, retry the process
        logger.info(`Task ID ${taskId} already exists. Retrying...`);
    }

    // If all retries fail, throw an error
    throw new APIError(
        409,
        "Unable to generate a unique task ID after multiple attempts."
    );
};
