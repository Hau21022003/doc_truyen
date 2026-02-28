import { Module } from '@nestjs/common';
import { StoryCommentService } from './story-comment.service';
import { StoryCommentController } from './story-comment.controller';

@Module({
  controllers: [StoryCommentController],
  providers: [StoryCommentService],
})
export class StoryCommentModule {}
