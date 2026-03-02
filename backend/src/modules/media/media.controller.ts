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
          description: 'Temporary ID to link uploaded media before publishing',
          example: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
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
