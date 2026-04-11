import { ExcelModule } from '@/modules/common/excel/excel.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkModule } from '../bookmark/bookmark.module';
import { MediaModule } from '../media/media.module';
import { ReadingHistoryModule } from '../reading-history/reading-history.module';
import { StoryViewDailyModule } from '../story-view-daily/story-view-daily.module';
import { StoryModule } from '../story/story.module';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ChapterContent } from './entities/chapter-content';
import { Chapter } from './entities/chapter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter, ChapterContent]),
    MediaModule,
    BookmarkModule,
    ReadingHistoryModule,
    StoryModule,
    StoryViewDailyModule,
    ExcelModule,
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
