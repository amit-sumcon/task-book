import { app } from "./app";
import { v2 as cloudinary } from "cloudinary";
import logger from "./config/logger";
import appConfig from "./config/app.config";

const PORT = appConfig.PORT;

// Define the configuration parameters
cloudinary.config({
    cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
    api_key: appConfig.CLOUDINARY_API_KEY,
    api_secret: appConfig.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
    logger.info(`http://localhost:${PORT}`);
});
