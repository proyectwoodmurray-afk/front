import { Controller, Post, UseInterceptors, UploadedFile } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import type { UploadService } from "./upload.service"
import type { Express } from "express"
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common"

@Controller("cloudinary")
export class UploadsController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image')) // 'image' should match the field name in FormData from frontend
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'image/(jpeg|png|gif|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadImageToCloudinary(file);
    return { imageUrl: result.secure_url }; // Return the secure URL
  }
}
