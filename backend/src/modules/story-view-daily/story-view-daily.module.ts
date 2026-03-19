import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryViewDaily } from './entities/story-view-daily.entity';
import { StoryViewDailyController } from './story-view-daily.controller';
import { StoryViewDailyService } from './story-view-daily.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryViewDaily])],
  controllers: [StoryViewDailyController],
  providers: [StoryViewDailyService],
  exports: [StoryViewDailyService],
})
export class StoryViewDailyModule {}
