import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateStoryCommentDto } from './dto/create-story-comment.dto';
import { FindByStoryDto } from './dto/find-by-story';
import { StoryCommentService } from './story-comment.service';

@Controller('story-comment')
export class StoryCommentController {
  constructor(private readonly storyCommentService: StoryCommentService) {}

  @Post()
  @Public()
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

  @Get('story/:storyId')
  @Public()
  async getCommentsByStory(@Query() query: FindByStoryDto) {
    return await this.storyCommentService.getCommentsByStory(query);
  }
}
