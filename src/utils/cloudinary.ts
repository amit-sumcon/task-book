import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import logger from "../config/logger"; // Import your logger instance here

const MAX_UPLOAD_TRIES = 2;

export const uploadToCloudinary = async (
    filePath: string,
    folderName: string
): Promise<UploadApiResponse | string> => {
    let tries = 0;

    while (tries < MAX_UPLOAD_TRIES) {
        try {
            if (!filePath) throw new Error("File path is required!");

            // Upload the file to Cloudinary
            const response = await cloudinary.uploader.upload(filePath, {
                resource_type: "auto",
                folder: `Spotify/${folderName}`,
            });

            if (response) {
                // Check if filePath is a file and delete it
                if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                    fs.unlinkSync(filePath); // Remove the specific file
                }
            }

            return response;
        } catch (error) {
            tries++;
            logger.error("Cloudinary Error: ", { error }); // Logging the Cloudinary error

            if (tries === MAX_UPLOAD_TRIES) {
                // Handle file cleanup on failure
                if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }

                logger.error(
                    "Cloudinary file upload operation failed after multiple attempts!"
                ); // Logging upload failure after multiple tries
                return "Cloudinary file upload operation failed after multiple attempts!";
            }
        }
    }

    return "Cloudinary file upload operation failed after multiple attempts!";
};
