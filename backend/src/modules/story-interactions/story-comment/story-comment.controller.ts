import { ParseIdsPipe } from '@/common/pipes/parse-ids.pipe';
import { AuthOptional } from '@/modules/auth/decorators/auth-optional.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { UserRole } from '@/modules/users/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStoryCommentDto } from './dto/create-story-comment.dto';
import { FindByStoryDto } from './dto/find-by-story.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { ReportStoryCommentDto } from './dto/report-comment.dto';
import { StoryCommentService } from './story-comment.service';

@Controller('story-comment')
export class StoryCommentController {
  constructor(private readonly storyCommentService: StoryCommentService) {}

  @Get()
  findAll(@Query() query: QueryCommentDto) {
    return this.storyCommentService.findAll(query);
  }

  @Get('story/:storyId')
  @Public()
  getCommentsByStory(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Query() query: FindByStoryDto,
  ) {
    return this.storyCommentService.getCommentsByStory(storyId, query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.storyCommentService.getById(id);
  }

  @Post()
  @AuthOptional()
  async create(
    @CurrentUser() user: JwtPayload | null,
    @Body() createStoryCommentDto: CreateStoryCommentDto,
  ) {
    const userId = user?.sub || null;

    return await this.storyCommentService.createComment(
      userId,
      createStoryCommentDto,
    );
  }

  @Post(':id/report')
  @AuthOptional()
  async reportComment(
    @Param('id', ParseIntPipe) commentId: number,
    @CurrentUser() user: JwtPayload | null,
    @Body() reportDto: ReportStoryCommentDto,
  ) {
    const reporterId = user?.sub || null; // null nếu guest

    return await this.storyCommentService.reportComment(
      commentId,
      reporterId,
      reportDto,
    );
  }

  @Delete('bulk')
  @Roles(UserRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMany(@Query('ids', ParseIdsPipe) ids: number[]) {
    return this.storyCommentService.deleteMany(ids);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.storyCommentService.deleteOne(id);
  }
}
