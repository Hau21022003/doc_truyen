// backend/src/modules/story-interactions/story-rating/story-rating.service.ts
import { Story } from '@/modules/story/entities/story.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateStoryDto } from './dto/rate-story.dto';
import { StoryRating } from './entities/story-rating.entity';

@Injectable()
export class StoryRatingService {
  constructor(
    @InjectRepository(StoryRating)
    private readonly ratingRepository: Repository<StoryRating>,
  ) {}

  async upsertRating(userId: string, rateStoryDto: RateStoryDto) {
    const { storyId, rating } = rateStoryDto;

    return await this.ratingRepository.manager.transaction(async (manager) => {
      await manager.upsert(
        StoryRating,
        {
          userId,
          storyId,
          rating,
        },
        ['userId', 'storyId'], // conflict column
      );

      const agg = await manager
        .createQueryBuilder(StoryRating, 'r')
        .select('AVG(r.rating)', 'avg')
        .addSelect('COUNT(*)', 'count')
        .where('r.storyId = :storyId', { storyId })
        .getRawOne();

      const averageRating = Number(agg.avg) || 0;
      const ratingCount = Number(agg.count) || 0;

      await manager.update(Story, storyId, {
        averageRating,
        ratingCount,
      });

      return {
        storyId,
        userRating: rating,
        averageRating,
        ratingCount,
      };
    });
  }
}
