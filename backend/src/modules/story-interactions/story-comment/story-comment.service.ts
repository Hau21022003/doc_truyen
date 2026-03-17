import { PaginatedResponseDto } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { StoryService } from '@/modules/story/story.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoryCommentDto } from './dto/create-story-comment.dto';
import { FindByStoryDto } from './dto/find-by-story';
import { StoryComment } from './entities/story-comment.entity';

@Injectable()
export class StoryCommentService {
  constructor(
    @InjectRepository(StoryComment)
    private readonly commentRepository: Repository<StoryComment>,
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
}
