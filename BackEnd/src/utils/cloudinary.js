import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // File has been uploaded successfully
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload failed
        return null;
    }
};

const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return null;
        
        // Extract the public_id from the full URL
        const publicId = imageUrl.split('/').pop().split('.')[0];
        
        if (!publicId) return null;

        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};
export { uploadOnCloudinary,deleteFromCloudinary  };