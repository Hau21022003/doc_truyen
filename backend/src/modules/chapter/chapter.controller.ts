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
} from '@nestjs/common';
import { AuthOptional } from '../auth/decorators/auth-optional.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../users/entities/user.entity';
import { ChapterService } from './chapter.service';
import {
  CreateChapterDto,
  UpdateChapterDto,
  UpdateChapterStatusDto,
} from './dto';
import { FindChaptersByStoryDto } from './dto/find-chapters-by-story.dto';

@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN)
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return { message: 'This endpoint returns all chapters with pagination' };
  }

  @Get('story/:storyId')
  @Public()
  async findByStoryId(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Query() query: FindChaptersByStoryDto,
  ) {
    return this.chapterService.findByStoryId(storyId, query);
  }

  @Get('story/:storySlug/:chapterNumber')
  @AuthOptional()
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

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.findOne(id);
  }

  // @Get(':id/read')
  // @AuthOptional()
  // getChapterDetailForUser(
  //   @Param('id') id: string,
  //   @CurrentUser() user: JwtPayload | null,
  // ) {
  //   console.log('user', user);
  //   return this.chapterService.getChapterDetailForUser(+id, user?.sub);
  // }

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
