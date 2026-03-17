import { PaginationDto } from '@/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type JwtPayload } from '../auth/types/jwt-payload.type';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.create(user.sub, createBookmarkDto);
  }

  @Get()
  findAllByUser(
    @CurrentUser() user: JwtPayload,
    @Query() queryDto: PaginationDto,
  ) {
    return this.bookmarkService.findAllByUser(user.sub, queryDto);
  }

  @Delete(':storyId')
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('storyId') storyId: string,
  ) {
    await this.bookmarkService.remove(user.sub, Number(storyId));
  }
}
