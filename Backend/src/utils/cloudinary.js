import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "gradlink",
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath); // Delete the local file after upload
    return response;
  } catch (error) {
    console.log("Cloudnary error (logo/avatar):", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Ensure the local file is deleted even if upload fails
    }
  }
};

const uploadPdfOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "gradlink",
      resource_type: "raw",
    });
    fs.unlinkSync(localFilePath); 
    return response;

  } catch (error) {
    console.log("Cloudnary error:",error);
    if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
    }
  }
};

export { uploadOnCloudinary, uploadPdfOnCloudinary };
