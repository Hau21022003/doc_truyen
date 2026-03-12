import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryRating } from './entities/story-rating.entity';
import { StoryRatingController } from './story-rating.controller';
import { StoryRatingService } from './story-rating.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryRating])],
  controllers: [StoryRatingController],
  providers: [StoryRatingService],
})
export class StoryRatingModule {}
