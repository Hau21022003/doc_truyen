// backend/src/modules/story-interactions/story-rating/story-rating.controller.ts
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { type JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { Body, Controller, Post } from '@nestjs/common';
import { RateStoryDto } from './dto/rate-story.dto';
import { StoryRatingService } from './story-rating.service';

@Controller('story-rating')
export class StoryRatingController {
  constructor(private readonly ratingService: StoryRatingService) {}

  @Post('rate')
  rateStory(
    @CurrentUser() user: JwtPayload,
    @Body() rateStoryDto: RateStoryDto,
  ) {
    return this.ratingService.upsertRating(user.sub, rateStoryDto);
  }
}
