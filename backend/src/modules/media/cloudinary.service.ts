import { AppConfigService } from '@/config/app-config.service';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { UploadOptions } from './media.types';

@Injectable()
export class CloudinaryService {
  constructor(private configService: AppConfigService) {
    cloudinary.config({
      cloud_name: this.configService.cloudinaryCloudName,
      api_key: this.configService.cloudinaryApiKey,
      api_secret: this.configService.cloudinaryApiSecret,
    });
  }

  async uploadImage(file: Express.Multer.File, options?: UploadOptions): Promise<UploadApiResponse> {
    const uploadOptions = {
      resource_type: 'auto' as const,
      folder: options?.folder,
      public_id: options?.publicId,
      overwrite: options?.overwrite ?? true,
    };

    if (file.buffer) {
      // Upload từ buffer
      const stream = Readable.from(file.buffer);
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        });
        stream.pipe(uploadStream);
      });
    }

    // Upload từ path (fallback)
    return cloudinary.uploader.upload(file.path, uploadOptions);
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
