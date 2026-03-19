import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyViewStatsResponseDto } from './dto/daily-view-stats-response.dto';
import { ViewStatsQueryDto } from './dto/view-stats-query.dto';
import { StoryViewDaily } from './entities/story-view-daily.entity';

@Injectable()
export class StoryViewDailyService {
  private readonly logger = new Logger(StoryViewDailyService.name);

  constructor(
    @InjectRepository(StoryViewDaily)
    private readonly viewDailyRepository: Repository<StoryViewDaily>,
  ) {}

  async getDailyViewStats(
    dto: ViewStatsQueryDto,
  ): Promise<DailyViewStatsResponseDto[]> {
    const { from, to } = dto;

    const rawData = await this.viewDailyRepository
      .createQueryBuilder('v')
      // .select('v.viewDate', 'date')
      .select("TO_CHAR(v.viewDate, 'YYYY-MM-DD')", 'date')
      .addSelect('SUM(v.totalViews)', 'totalViews')
      .where('v.viewDate BETWEEN :from AND :to', { from, to })
      .groupBy('v.viewDate')
      .orderBy('v.viewDate', 'ASC')
      .getRawMany();

    return this.fillMissingDates(from, to, rawData);

    // return this.viewDailyRepository
    //   .createQueryBuilder('v')
    //   .select('v.viewDate', 'date')
    //   .addSelect('SUM(v.totalViews)', 'totalViews')
    //   .where('v.viewDate BETWEEN :from AND :to', { from, to })
    //   .groupBy('v.viewDate')
    //   .orderBy('v.viewDate', 'ASC')
    //   .getRawMany();
  }

  /**
   * Ghi lượt view - thread-safe
   * Tự động tạo mới nếu chưa có, hoặc tăng nếu đã tồn tại
   *
   * @param storyId - ID của truyện
   * @param date - Ngày muốn ghi (default: hôm nay)
   */
  async recordView(storyId: number, date: Date = new Date()): Promise<void> {
    try {
      const viewDate = this.toDateOnly(date);

      const result = await this.viewDailyRepository
        .createQueryBuilder()
        .insert()
        .into(StoryViewDaily)
        .values({
          storyId,
          viewDate,
          totalViews: 1,
        })
        .onConflict(
          `
            ("storyId", "viewDate")
            DO UPDATE SET "totalViews" = "story_view_daily"."totalViews" + 1
          `,
        )
        .execute();

      if (result.identifiers.length > 0) {
        this.logger.debug(
          `Created new view record for story ${storyId} on ${viewDate}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to record view for story ${storyId}:`, error);
    }
  }

  /**
   * Helper: Convert Date to date-only (UTC midnight)
   */
  private toDateOnly(date: Date): string {
    const offset = 7 * 60; // UTC+7
    const local = new Date(date.getTime() + offset * 60000);
    return local.toISOString().slice(0, 10);
  }

  private fillMissingDates(from: string, to: string, data: any[]) {
    const map = new Map(
      data.map((item) => [
        new Date(item.date).toISOString().slice(0, 10),
        Number(item.totalViews),
      ]),
    );

    const result: DailyViewStatsResponseDto[] = [];
    let current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
      const dateStr = current.toISOString().slice(0, 10);

      result.push({
        date: dateStr,
        totalViews: map.get(dateStr) || 0,
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  }
}
