// src/gallery/gallery.service.ts
import { Injectable, BadRequestException } from "@nestjs/common"
import type { GalleryDocument } from "./schemas/gallery.schema"
import type { Model } from "mongoose"
import type { CreateGalleryDto } from "./dto/create-gallery.dto"
import type { CloudinaryService } from "../cloudinary/cloudinary.service"
import type { Express } from "express"
import { v2 as cloudinary } from "cloudinary" // Mantener la importación para cloudinary.uploader.destroy

@Injectable()
export class GalleryService {
  galleryModel: Model<GalleryDocument>
  cloudinaryService: CloudinaryService

  constructor(
    galleryModel: Model<GalleryDocument>,
    cloudinaryService: CloudinaryService,
    // No inyectes 'cloudinary' directamente si ya lo usas a través de v2 as cloudinary
    // private cloudinary: Cloudinary // Esto causaría un error si no está provisto
  ) {
    this.galleryModel = galleryModel
    this.cloudinaryService = cloudinaryService
    // La configuración de Cloudinary ya se hace en CloudinaryService, no es necesaria aquí.
  }

  async create(file: Express.Multer.File, dto: CreateGalleryDto) {
    try {
      // Subir imagen a Cloudinary
      const result = await this.cloudinaryService.uploadImage(file)

      // Los tags ya vienen parseados a un array gracias a @Transform en CreateGalleryDto
      const newGallery = new this.galleryModel({
        ...dto,
        imageUrl: result.secure_url,
        tags: dto.tags, // Usar los tags que ya son un array
      })

      return await newGallery.save()
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new Error(`Error al crear item de galería: ${error.message}`)
    }
  }

  findAll() {
    return this.galleryModel.find().exec()
  }

  async delete(id: string) {
    const item = await this.galleryModel.findById(id)
    if (!item) {
      throw new BadRequestException("Imagen no encontrada")
    }

    const parts = item.imageUrl.split("/")
    const publicIdWithExtension = parts[parts.length - 1]
    const publicId = publicIdWithExtension.split(".")[0]

    try {
      // Eliminar la imagen de Cloudinary
      // Asegúrate de que 'gallery/' coincida con el folder usado al subir
      await cloudinary.uploader.destroy(`gallery/${publicId}`)
      // Eliminar el documento de la base de datos
      return this.galleryModel.findByIdAndDelete(id).exec()
    } catch (error) {
      throw new BadRequestException("Error al eliminar la imagen: " + error.message)
    }
  }

  findByTags(tags: string[]) {
    return this.galleryModel.find({ tags: { $in: tags } }).exec()
  }
}
