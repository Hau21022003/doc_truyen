import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { StoryModule } from '../story/story.module';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ChapterContent } from './entities/chapter-content';
import { Chapter } from './entities/chapter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter, ChapterContent]),
    MediaModule,
    StoryModule,
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
