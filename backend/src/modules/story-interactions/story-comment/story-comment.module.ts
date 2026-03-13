import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryComment } from './entities/story-comment.entity';
import { StoryCommentController } from './story-comment.controller';
import { StoryCommentService } from './story-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryComment, Chapter])],
  controllers: [StoryCommentController],
  providers: [StoryCommentService],
})
export class StoryCommentModule {}
