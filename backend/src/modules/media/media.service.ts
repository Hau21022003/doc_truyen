import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UploadOptions, UploadResult } from './media.types';

@Injectable()
export class MediaService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    // Có thể thêm các service khác như LocalStorageService, S3Service trong tương lai
  ) {}

  async uploadImage(file: Express.Multer.File, options?: UploadOptions): Promise<UploadResult> {
    const result = await this.cloudinaryService.uploadImage(file, options);

    // Các xử lý bổ sung: resize, optimize, metadats, v.v.
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async deleteImage(publicId: string): Promise<void> {
    return this.cloudinaryService.deleteImage(publicId);
  }
}
