import { ALLOWED_MIMES, createMulterOptions, FILE_SIZES_MB } from '@/common';
import { ParseIdsPipe } from '@/common/pipes/parse-ids.pipe';
import { Public } from '@/modules/auth/decorators/public.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { type Response } from 'express';
import { AuthOptional } from '../auth/decorators/auth-optional.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../users/entities/user.entity';
import { ChapterService } from './chapter.service';
import {
  CreateChapterDto,
  FindChaptersByStoryDto,
  UpdateChapterDto,
  UpdateChapterStatusDto,
} from './dto';

@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  // Import
  @Post(':storyId/import')
  @UseInterceptors(
    FileInterceptor(
      'file',
      createMulterOptions(FILE_SIZES_MB.DOCUMENT, ALLOWED_MIMES.EXCEL),
    ),
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
      },
    },
  })
  async importChapters(
    @Param('storyId') storyId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chapterService.importFromBuffer(storyId, file.buffer);
  }

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN)
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return { message: 'This endpoint returns all chapters with pagination' };
  }

  // Export
  @Get(':storyId/export')
  async exportChapters(
    @Param('storyId') storyId: number,
    @Res() res: Response,
  ) {
    const buffer = await this.chapterService.exportByStoryId(storyId);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="chapters-${storyId}.xlsx"`,
    );
    res.send(buffer);
  }

  @AuthOptional()
  @Get('story/:storySlug/:chapterNumber')
  async findByStorySlugAndChapterNumber(
    @Param('storySlug') storySlug: string,
    @Param('chapterNumber', ParseIntPipe) chapterNumber: number,
    @CurrentUser() user: JwtPayload | null,
  ) {
    return this.chapterService.findByStorySlugAndChapterNumber(
      storySlug,
      chapterNumber,
      user?.sub,
    );
  }

  @Get('story/:storyId')
  @Public()
  async findByStoryId(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Query() query: FindChaptersByStoryDto,
  ) {
    return this.chapterService.findByStoryId(storyId, query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.SYSTEM_ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChapterStatusDto,
  ) {
    return this.chapterService.updateStatus(id, dto);
  }

  @Patch(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chapterService.update(id, updateChapterDto);
  }

  @Delete('bulk')
  @Roles(UserRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMany(@Query('ids', ParseIdsPipe) ids: number[]) {
    return this.chapterService.removeMany(ids);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.remove(id);
  }
}
