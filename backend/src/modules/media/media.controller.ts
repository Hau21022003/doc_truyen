import { createMulterOptions, FILE_SIZES_MB } from '@/common';
import { MEDIA_FOLDER } from '@/modules/media/constants/media.constants';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import * as path from 'path';
import { Public } from '../auth/decorators/public.decorator';
import { UploadDraftDto } from './dto/upload-draft.dto';
import { UploadDto } from './dto/upload.dto';
import { MediaService } from './media.service';

@Public()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-draft')
  @UseInterceptors(
    FileInterceptor('file', createMulterOptions(FILE_SIZES_MB.DOCUMENT)),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        tempId: {
          type: 'string',
          description: 'Temporary ID to link uploaded media before publishing',
          example: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
        },
      },
      required: ['file'],
    },
  })
  async uploadDraft(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDraftDto,
  ) {
    return this.mediaService.uploadWithTempId(file, {
      tempId: dto.tempId,
      folder: MEDIA_FOLDER,
    });
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', createMulterOptions(FILE_SIZES_MB.DOCUMENT)),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        // publicId: {
        //   type: 'string',
        //   description: 'PublicId for image in cloudinary',
        //   example: 'cover-image-story-doraemon-0',
        // },
        folder: {
          type: 'string',
          description: 'folder\`s image in cloudinary',
          example: 'story',
        },
      },
      required: ['file'],
    },
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDto,
  ) {
    const publicId = dto?.publicId || this.generatePublicId(file);
    return this.mediaService.uploadImage(file, {
      publicId: publicId,
      folder: dto.folder || MEDIA_FOLDER,
    });
  }

  private generatePublicId(file: Express.Multer.File) {
    const name = path.parse(file.originalname).name;

    // sanitize: bỏ dấu, ký tự đặc biệt, space → -
    const safeName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();

    return `${safeName}-${Date.now()}`;
  }
}
