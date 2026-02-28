import { Module } from '@nestjs/common';
import { StoryLikeService } from './story-like.service';
import { StoryLikeController } from './story-like.controller';

@Module({
  controllers: [StoryLikeController],
  providers: [StoryLikeService],
})
export class StoryLikeModule {}
