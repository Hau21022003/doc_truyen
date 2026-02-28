import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';
import { MediaStatus, MediaUsage } from './constants/media.constants';
import { Media } from './entities/media.entity';
import { UploadOptions, UploadResult } from './types/media.types';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    private readonly cloudinaryService: CloudinaryService,
    // Có thể thêm các service khác như LocalStorageService, S3Service trong tương lai
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    const result = await this.cloudinaryService.uploadImage(file, options);

    // Lưu vào database
    await this.mediaRepo.save({
      publicId: result.public_id,
      url: result.secure_url,
      status: MediaStatus.PUBLISHED,
    });

    return {
      url: result.secure_url,
    };
  }

  async deleteByUrl(url: string): Promise<void> {
    const media = await this.mediaRepo.findOne({ where: { url } });
    if (!media) return;

    await this.cloudinaryService.deleteImage(media.publicId);
    await this.mediaRepo.delete({ id: media.id });
  }

  // Upload với trạng thái draft
  async uploadWithTempId(
    file: Express.Multer.File,
    options: { tempId: string } & UploadOptions,
  ): Promise<UploadResult> {
    const result = await this.cloudinaryService.uploadImage(file, options);

    await this.mediaRepo.save({
      publicId: result.public_id,
      url: result.secure_url,
      tempId: options.tempId,
      status: MediaStatus.DRAFT,
    });

    return {
      url: result.secure_url,
    };
  }

  // Cập nhật media từ draft sang published
  async publishMedia(tempId: string, usage: MediaUsage) {
    const media = await this.mediaRepo.findOne({ where: { tempId } });
    if (!media) throw new NotFoundException('Media not found');

    // Cập nhật thông tin media
    await this.mediaRepo.update(
      { tempId },
      {
        usage: usage,
        status: MediaStatus.PUBLISHED,
        tempId: null,
      },
    );

    return media;
  }
}
