import { StoryModule } from '@/modules/story/story.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryCommentReport } from './entities/story-comment-report.entity';
import { StoryComment } from './entities/story-comment.entity';
import { StoryCommentController } from './story-comment.controller';
import { StoryCommentService } from './story-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoryComment, StoryCommentReport]),
    StoryModule,
  ],
  controllers: [StoryCommentController],
  providers: [StoryCommentService],
})
export class StoryCommentModule {}
