import { Module } from '@nestjs/common';
import { StoryCommentModule } from './story-comment/story-comment.module';
import { StoryLikeModule } from './story-like/story-like.module';

@Module({
  imports: [StoryCommentModule, StoryLikeModule],
  exports: [StoryCommentModule, StoryLikeModule],
})
export class StoryInteractionsModule {}
