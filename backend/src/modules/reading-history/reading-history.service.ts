import { PaginatedResponseDto, PaginationDto } from '@/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingHistory } from './entities/reading-history.entity';

@Injectable()
export class ReadingHistoryService {
  private readonly logger = new Logger(ReadingHistoryService.name);
  private readonly MAX_HISTORY_PER_USER = 30;

  constructor(
    @InjectRepository(ReadingHistory)
    private historyRepository: Repository<ReadingHistory>,
  ) {}

  async addHistory(userId: string, storyId: number, chapterId: number) {
    const history = this.historyRepository.create({
      userId,
      storyId,
      chapterId,
    });

    const savedHistory = await this.historyRepository.save(history);

    // 2. Async cleanup (non-blocking, fire and forget)
    this.cleanupOldHistories(userId).catch((error) => {
      this.logger.error(`Async cleanup failed for user ${userId}:`, error);
    });

    return savedHistory;
  }

  async findByUser(
    userId: string,
    query: PaginationDto,
  ): Promise<PaginatedResponseDto<ReadingHistory>> {
    const { page, limit } = query;

    const qb = this.historyRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.story', 'story')
      .leftJoinAndSelect('history.chapter', 'chapter')
      .where('history.userId = :userId', { userId });

    qb.orderBy('history.createdAt', 'DESC');

    qb.skip((page - 1) * limit).take(limit);

    const [histories, total] = await qb.getManyAndCount();

    return {
      data: histories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async cleanupOldHistories(userId: string): Promise<void> {
    const deleteResult = await this.historyRepository.query(
      `
      DELETE FROM reading_history
      WHERE id IN (
        SELECT id FROM (
          SELECT id,
          ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt" DESC) as rn
          FROM reading_history
          WHERE "userId" = $1
        ) t
        WHERE rn > $2
      )
    `,
      [userId, this.MAX_HISTORY_PER_USER],
    );

    if (deleteResult.rowCount > 0) {
      this.logger.debug(
        `Async cleanup: ${deleteResult} records deleted for user ${userId}`,
      );
    }
  }
}
