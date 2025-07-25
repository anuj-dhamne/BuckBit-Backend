import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

const uploadOnCloudinary=async(localFilePath)=>{
    
    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

try {
    if(!localFilePath)return null;
    const response=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath); 
    }
    return response;
} catch (error) {
     console.error("Cloudinary upload error:", error.message); 
    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);  
    }
    return null;
}
}

export {uploadOnCloudinary};

