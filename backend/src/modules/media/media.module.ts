import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { MediaService } from './media.service';

@Module({
  providers: [CloudinaryService, MediaService],
  exports: [MediaService],
  // Chỉ export MediaService, không export CloudinaryService
})
export class MediaModule {}
