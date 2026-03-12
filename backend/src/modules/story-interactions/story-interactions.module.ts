import { Module } from '@nestjs/common';
import { StoryCommentModule } from './story-comment/story-comment.module';
import { StoryRatingModule } from './story-rating/story-rating.module';

@Module({
  imports: [StoryCommentModule, StoryRatingModule],
  exports: [StoryCommentModule, StoryRatingModule],
})
export class StoryInteractionsModule {}
