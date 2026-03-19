import {
  PaginatedResponseDto,
  PaginationDto,
  QueryBuilderHelper,
} from '@/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '../story/entities/story.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarkService {
  private readonly ENTITY_ALIAS = 'bookmark';

  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
  ) {}

  async create(
    userId: string,
    createBookmarkDto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    return await this.bookmarkRepository.manager.transaction(
      async (manager) => {
        // Check if bookmark already exists
        const existingBookmark = await manager.findOne(Bookmark, {
          where: {
            userId,
            storyId: createBookmarkDto.storyId,
          },
        });

        if (existingBookmark) {
          throw new ConflictException(
            `Bookmark for story ${createBookmarkDto.storyId} already exists`,
          );
        }

        // Create bookmark
        const bookmark = manager.create(Bookmark, {
          userId,
          storyId: createBookmarkDto.storyId,
          lastReadChapterId: createBookmarkDto.lastReadChapterId,
        });

        const savedBookmark = await manager.save(bookmark);

        // Increment story's bookmarkCount
        await manager.increment(
          Story,
          { id: createBookmarkDto.storyId },
          'bookmarkCount',
          1,
        );

        return savedBookmark;
      },
    );
  }

  async remove(userId: string, storyId: number) {
    return await this.bookmarkRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Find bookmark to delete
        const bookmark = await transactionalEntityManager.findOne(Bookmark, {
          where: { userId, storyId },
        });

        if (!bookmark) {
          throw new NotFoundException(
            `Bookmark for story ${storyId} not found`,
          );
        }

        // Delete bookmark
        await transactionalEntityManager.remove(bookmark);

        // Decrement story's bookmarkCount
        await transactionalEntityManager.decrement(
          Story,
          { id: storyId },
          'bookmarkCount',
          1,
        );
      },
    );
  }

  async findAllByUser(
    userId: string,
    queryDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Bookmark>> {
    const { page, limit } = queryDto;

    let queryBuilder = this.bookmarkRepository
      .createQueryBuilder(this.ENTITY_ALIAS)
      .leftJoinAndSelect(`${this.ENTITY_ALIAS}.story`, 'story')
      .leftJoinAndSelect(
        `${this.ENTITY_ALIAS}.lastReadChapter`,
        'lastReadChapter',
      )
      .where(`${this.ENTITY_ALIAS}.userId = :userId`, { userId })
      .orderBy(`${this.ENTITY_ALIAS}.updatedAt`, 'DESC');

    // Apply pagination using helper
    queryBuilder = QueryBuilderHelper.applyPagination(
      queryBuilder,
      page,
      limit,
    );

    const [bookmarks, total] = await queryBuilder.getManyAndCount();

    return {
      data: bookmarks,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update the last read chapter ID for a user's bookmark
   * Creates a bookmark if one doesn't exist yet
   * @param userId - User ID from JWT payload
   * @param storyId - Story ID
   * @param chapterId - Chapter ID to set as last read
   * @returns The updated or created bookmark
   */
  async updateLastReadChapter(
    userId: string,
    storyId: number,
    chapterId: number,
  ) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { userId, storyId },
    });

    // chỉ update nếu bookmark tồn tại
    if (!bookmark) return;

    bookmark.lastReadChapterId = chapterId;

    await this.bookmarkRepository.save(bookmark);
  }
}
