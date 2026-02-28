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
import { Public } from '../auth/decorators/public.decorator';
import { UploadDto } from './dto/upload-draft.dto';
import { MediaService } from './media.service';

@Public()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

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
        tempId: {
          type: 'string',
        },
      },
      required: ['file'],
    },
  })
  async uploadDraft(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDto,
  ) {
    return this.mediaService.uploadWithTempId(file, {
      tempId: dto.tempId,
      folder: MEDIA_FOLDER,
    });
  }
}
