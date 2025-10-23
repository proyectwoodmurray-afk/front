import { Injectable } from "@nestjs/common"
import { v2 as cloudinary } from "cloudinary"
import toStream = require("buffer-to-stream")
import type { Express } from "express"

@Injectable()
export class UploadService {
  constructor() {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async uploadImageToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "murrayandson" }, // Specify a folder in Cloudinary
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        },
      )
      toStream(file.buffer).pipe(upload)
    })
  }
}
