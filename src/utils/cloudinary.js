import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Asynchronous function to upload a file to Cloudinary
const uploadOnCloud = async (FilePath) => {
  try {
    // Check if FilePath is provided
    if (!FilePath) return null; // If no file path is provided, return null

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(FilePath, {
      resource_type: "auto", // Automatically detect the resource type (image, video, etc.)
    });

    // Log the response from Cloudinary
    console.log(response);

    // Return the response from Cloudinary
    return response;
  } catch (error) {
    // If there is an error during the upload, remove the file from the local filesystem
    fs.unlinkSync(FilePath); // Delete the file to avoid storing unnecessary files

    // Return null if there was an error
    return null;
  }
};

// Export the uploadOnCloud function to be used in other modules
export { uploadOnCloud };
