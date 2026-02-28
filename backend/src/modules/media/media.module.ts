import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from './cloudinary.service';
import { Media } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [CloudinaryService, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
