// src/cloudinary/cloudinary.service.ts
import { Injectable } from "@nestjs/common"
import { v2 as cloudinary } from "cloudinary"
import type { ConfigService } from "@nestjs/config"
import type { Express } from "express"

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.get("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
    })
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      const b64 = Buffer.from(file.buffer).toString("base64")
      const dataURI = `data:${file.mimetype};base64,${b64}`
      return await cloudinary.uploader.upload(dataURI, {
        folder: "gallery", // Asegúrate de que este folder coincida con el usado al eliminar
      })
    } catch (error) {
      throw new Error(`Error al subir imagen a Cloudinary: ${error.message}`)
    }
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      return await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      throw new Error(`Error al eliminar imagen de Cloudinary: ${error.message}`)
    }
  }
}
