import { v4 as uuidv4 } from "uuid";
import prisma from "../database/prismaClient";

export const generateUniqueUsernameFromName = async (name: string): Promise<string> => {
    // Step 1: Create a base username
    const nameParts = name.split(" ");
    const baseUsername =
        nameParts.length >= 2
            ? `${nameParts[0].toLowerCase()}${nameParts[nameParts.length - 1].toLowerCase()}`
            : name.toLowerCase().replace(/\s/g, "");

    let uniqueUsername = baseUsername;
    let isExists = true;

    // Step 2: Check for uniqueness and adjust if needed
    while (isExists) {
        // Append a short UUID to ensure uniqueness
        const uuidSuffix = uuidv4().replace(/-/g, "").substring(0, 4);
        uniqueUsername = `${baseUsername}_${uuidSuffix}`;

        // Step 3: Check if the generated username already exists
        isExists =
            (await prisma.user.findUnique({
                where: {
                    username: uniqueUsername,
                },
            })) !== null;
    }

    return uniqueUsername;
};
