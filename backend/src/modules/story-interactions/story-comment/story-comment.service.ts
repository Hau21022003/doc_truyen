import { PaginatedResponseDto, QueryBuilderHelper } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { StoryService } from '@/modules/story/story.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { CreateStoryCommentDto } from './dto/create-story-comment.dto';
import { FindByStoryDto } from './dto/find-by-story.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { ReportStoryCommentDto } from './dto/report-comment.dto';
import { StoryCommentReport } from './entities/story-comment-report.entity';
import { StoryComment } from './entities/story-comment.entity';

@Injectable()
export class StoryCommentService {
  constructor(
    @InjectRepository(StoryComment)
    private readonly commentRepository: Repository<StoryComment>,

    @InjectRepository(StoryCommentReport)
    private readonly reportRepository: Repository<StoryCommentReport>,

    private readonly storyService: StoryService,
  ) {}

  async createComment(
    userId: string | null,
    createStoryCommentDto: CreateStoryCommentDto,
  ) {
    const { storyId, content, guestName, chapterId } = createStoryCommentDto;

    // Guest validation
    if (!userId && !guestName) {
      throw new BadRequestException('guestName là bắt buộc khi chưa đăng nhập');
    }

    if (userId && guestName) {
      throw new BadRequestException(
        'Không nên cung cấp guestName khi đã đăng nhập',
      );
    }

    return await this.commentRepository.manager.transaction(async (manager) => {
      // Validate chapter belongs to story
      if (chapterId) {
        const chapter = await manager.findOne(Chapter, {
          where: { id: chapterId, story: { id: storyId } },
        });

        if (!chapter) {
          throw new BadRequestException(
            'Chapter không tồn tại hoặc không thuộc story này',
          );
        }
      }

      const comment = manager.create(StoryComment, {
        storyId,
        chapterId: chapterId ?? null,
        userId,
        guestName,
        content,
      });

      const savedComment = await manager.save(StoryComment, comment);

      // tăng commentCount cho story
      await manager.increment(Story, { id: storyId }, 'commentCount', 1);

      return savedComment;
    });
  }

  async getCommentsByStory(
    storyId: number,
    query: FindByStoryDto,
  ): Promise<PaginatedResponseDto<any>> {
    // check story
    await this.storyService.findOne(storyId);

    const { limit, page, chapterId } = query;

    const qb = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.chapter', 'chapter')
      .where('comment.storyId = :storyId', { storyId });

    // Nếu có chapterId → ưu tiên comment chapter đó
    if (chapterId) {
      qb.addSelect(
        'CASE WHEN comment.chapterId = :chapterId THEN 0 ELSE 1 END',
        'chapter_priority',
      )
        .setParameter('chapterId', chapterId)
        .orderBy('chapter_priority', 'ASC');
    }

    qb.addOrderBy('comment.createdAt', 'DESC');

    qb.skip((page - 1) * limit).take(limit);

    const [comments, total] = await qb.getManyAndCount();

    const formatted = comments.map((comment) => ({
      id: comment.id,
      storyId: comment.storyId,
      chapterId: comment.chapterId,
      chapter: comment.chapter
        ? {
            id: comment.chapter.id,
            title: comment.chapter.title,
            chapterNumber: comment.chapter.chapterNumber,
          }
        : null,
      userId: comment.userId,
      userName: comment.user?.name || comment.guestName,
      userAvatar: comment.user?.avatar || null,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return {
      data: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Báo cáo comment xấu
  async reportComment(
    commentId: number,
    reporterId: string | null,
    reportDto: ReportStoryCommentDto,
  ) {
    // Check comment exists
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment với ID ${commentId} không tồn tại`);
    }

    // Check nếu user đã báo cáo comment này
    if (reporterId) {
      const existingReport = await this.reportRepository.findOne({
        where: { commentId, reporterId },
      });

      if (existingReport) {
        throw new BadRequestException('Bạn đã báo cáo comment này');
      }
    }

    // Tạo report
    const report = this.reportRepository.create({
      commentId,
      reporterId,
      reason: reportDto.reason,
      description: reportDto.description,
    });

    await this.reportRepository.save(report);

    // Update comment: increment flagCount và set isFlagged
    await this.commentRepository.update(
      { id: commentId },
      {
        flagCount: () => '"flagCount" + 1',
        isFlagged: true,
      },
    );

    return {
      success: true,
      message: 'Báo cáo comment thành công. Di moderation team sẽ xem xét.',
    };
  }

  async findAll(query: QueryCommentDto) {
    const entityAlias = 'comment';
    const { search, isFlagged, limit, page, sortBy, sortOrder } = query;
    let queryBuilder = this.commentRepository
      .createQueryBuilder(entityAlias)
      .leftJoinAndSelect(`${entityAlias}.user`, 'user')
      .leftJoinAndSelect(`${entityAlias}.story`, 'story');

    // Filter by flag status
    queryBuilder = QueryBuilderHelper.applyBooleanFilter(
      queryBuilder,
      entityAlias,
      'isFlagged',
      isFlagged,
    );

    // Search: comment content + story title + user name (người đăng)
    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`${entityAlias}.content ILIKE :search`, {
            search: `%${search}%`,
          })
            .orWhere(`story.title ILIKE :search`, { search: `%${search}%` })
            .orWhere(`user.name ILIKE :search`, { search: `%${search}%` })
            .orWhere(`${entityAlias}.guestName ILIKE :search`, {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Apply sorting using helper
    queryBuilder = QueryBuilderHelper.applySorting(
      queryBuilder,
      entityAlias,
      sortBy,
      sortOrder,
      ['createdAt', 'updatedAt', 'flagCount'],
    );

    // Apply pagination using helper
    queryBuilder = QueryBuilderHelper.applyPagination(
      queryBuilder,
      page,
      limit,
    );

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy chi tiết comment theo ID (kèm các reports)
  async getById(id: number) {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.story', 'story')
      .leftJoinAndSelect('comment.chapter', 'chapter')
      .leftJoinAndSelect('comment.reports', 'reports')
      .leftJoinAndSelect('reports.reporter', 'reporter')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) {
      throw new NotFoundException(`Comment với ID ${id} không tồn tại`);
    }

    return comment;
  }

  async deleteOne(id: number): Promise<{ success: boolean; message: string }> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(`Comment với ID ${id} không tồn tại`);
    }

    await this.commentRepository.manager.transaction(async (manager) => {
      // Xóa comment
      await manager.remove(StoryComment, comment);

      // Giảm commentCount cho story
      await manager.decrement(
        Story,
        { id: comment.storyId },
        'commentCount',
        1,
      );
    });

    return {
      success: true,
      message: `Comment với ID ${id} đã được xóa`,
    };
  }

  async deleteMany(
    ids: number[],
  ): Promise<{ success: boolean; message: string; deletedCount: number }> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('IDs không được để trống');
    }

    // Get comments to be deleted
    const comments = await this.commentRepository.findBy({
      id: In(ids),
    });

    if (comments.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy comment nào với IDs được cung cấp',
      );
    }

    await this.commentRepository.manager.transaction(async (manager) => {
      // Group by storyId để giảm commentCount đúng cho từng story
      const storyIds = new Set(comments.map((c) => c.storyId));

      for (const storyId of storyIds) {
        const commentsInStory = comments.filter((c) => c.storyId === storyId);
        await manager.decrement(
          Story,
          { id: storyId },
          'commentCount',
          commentsInStory.length,
        );
      }

      // Xóa all comments
      await manager.remove(StoryComment, comments);
    });

    return {
      success: true,
      message: `Đã xóa ${comments.length} comments thành công`,
      deletedCount: comments.length,
    };
  }
}
