import { ALLOWED_MIMES, createMulterOptions, FILE_SIZES_MB } from '@/common';
import { ParseIdsPipe } from '@/common/pipes/parse-ids.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
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
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FindBySlugDto } from './dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { HomeStoryQueryDto } from './dto/home-story-query.dto';
import { HotStoryQueryDto } from './dto/hot-story-query.dto';
import { QueryStoryDto } from './dto/query-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryService } from './story.service';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  create(@Body() createStoryDto: CreateStoryDto) {
    return this.storyService.create(createStoryDto);
  }

  @Post('import')
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
      required: ['file'],
    },
  })
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    return this.storyService.importExcel(file.buffer);
  }

  @Get()
  @Public()
  findAll(@Query() queryDto: QueryStoryDto) {
    return this.storyService.findAll(queryDto);
  }

  @Get('export')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="stories.xlsx"')
  async exportChapters(@Res() res: Response) {
    const buffer = await this.storyService.exportExcel();
    res.end(buffer);
  }

  @Get('home')
  @Public()
  findHomepage(@Query() queryDto: HomeStoryQueryDto) {
    return this.storyService.findHomepage(queryDto);
  }

  @Get('stats')
  @Public()
  getStats() {
    return this.storyService.getStats();
  }

  @Get('hot-stories')
  @Public()
  findHotStories(@Query() queryDto: HotStoryQueryDto) {
    return this.storyService.findHotStories(queryDto);
  }

  @Get('slug/:slug')
  @Public()
  findBySlug(@Param('slug') slug: string, @Query() query: FindBySlugDto) {
    return this.storyService.findBySlug(slug, query.chapterSort);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.storyService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
    return this.storyService.update(+id, updateStoryDto);
  }

  @Delete('bulk')
  @Roles(UserRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMany(@Query('ids', ParseIdsPipe) ids: number[]) {
    return this.storyService.removeMany(ids);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storyService.remove(id);
  }
}
