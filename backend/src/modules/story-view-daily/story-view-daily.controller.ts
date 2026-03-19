import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ViewStatsQueryDto } from './dto/view-stats-query.dto';
import { StoryViewDailyService } from './story-view-daily.service';

@Controller('story-views')
@Roles(UserRole.SYSTEM_ADMIN)
export class StoryViewDailyController {
  constructor(private readonly storyViewDailyService: StoryViewDailyService) {}

  @Get('daily')
  getDailyViewStats(@Query() dto: ViewStatsQueryDto) {
    return this.storyViewDailyService.getDailyViewStats(dto);
  }
}
