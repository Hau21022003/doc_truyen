import {
  createDateRangeInUTC,
  PaginatedResponseDto,
  QueryBuilderHelper,
  SortDirections,
  toSlug,
} from '@/common';
import { ExcelService } from '@/modules/common/excel/excel.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChapterStatus } from '../chapter/entities/chapter.entity';
import { CacheService } from '../common/cache/cache.service';
import { MediaUsage } from '../media/constants/media.constants';
import { MediaService } from '../media/media.service';
import { TagsService } from '../tags/tags.service';
import {
  HOT_STORY_CONFIG,
  STORY_EXCEL_COLUMNS,
  STORY_SEARCHABLE_COLUMNS,
  STORY_SORTABLE_COLUMNS,
} from './constants/story.constants';
import { StoryStatsResponseDto } from './dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { HomeStoryQueryDto } from './dto/home-story-query.dto';
import { HotStoryQueryDto } from './dto/hot-story-query.dto';
import { QueryStoryDto } from './dto/query-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story, StoryProgress, StoryStatus } from './entities/story.entity';

@Injectable()
export class StoryService {
  private readonly ENTITY_ALIAS = 'story';

  private readonly CacheKeys = {
    story: (id: number) => `story:${id}`,
    storySlug: (slug: string) => `story:slug:${slug}`,
    storyStats: () => 'story:stats',
    hotStories: (limit: number) => `story:hot:${limit}`,
    storyQueries: () => 'story:query:*',
    storyQuery: (query: object) =>
      this.cacheService.buildKey('story:query', query),
    homepageQueries: () => 'story:homepage:*',
    homepageQuery: (query: object) =>
      this.cacheService.buildKey('story:homepage', query),
  };

  private readonly TTL = {
    single: 600_000, // 10 phút — findOne / findBySlug
    list: 300_000, // 5 phút  — findAll / findHotStories / getStats
    homepage: 180_000, // 3 phút  — findHomepage (user-facing, cần fresher hơn)
  };

  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    private readonly tagsService: TagsService,
    private readonly mediaService: MediaService,
    private readonly excelService: ExcelService,
    private readonly cacheService: CacheService,
  ) {}

  // ─── Write operations ────────────────────────────────────────────────────

  async create(
    createStoryDto: CreateStoryDto,
    coverImage?: string,
  ): Promise<Story> {
    this.normalizeSlug(createStoryDto);

    await this.checkUniqueFields(createStoryDto);

    const { tagIds, coverImageTempId, ...rest } = createStoryDto;

    const tags = await this.validateAndGetTags(tagIds);

    const story = this.storyRepository.create({
      ...rest,
      tags,
    });

    if (coverImageTempId) {
      story.coverImage = await this.handleCoverImageTemp(coverImageTempId);
    }

    if (coverImage) {
      story.coverImage = coverImage;
    }

    // return this.storyRepository.save(story);
    const saved = await this.storyRepository.save(story);

    // Warm cache cho entity vừa tạo + xóa list cache
    await this.invalidateListCache();

    return saved;
  }

  /**
   * Tăng viewCount của story
   * @param storyId - ID của story cần tăng view
   * @returns Promise<void>
   */
  async incrementViewCount(storyId: number): Promise<void> {
    await this.storyRepository.increment({ id: storyId }, 'viewCount', 1);
  }

  async update(id: number, updateStoryDto: UpdateStoryDto): Promise<Story> {
    const story = await this.findOne(id);

    this.normalizeSlug(updateStoryDto);

    await this.checkUniqueFields(updateStoryDto, id);

    const { tagIds, coverImageTempId, ...rest } = updateStoryDto;

    Object.assign(story, rest);

    if (tagIds !== undefined) {
      story.tags = await this.validateAndGetTags(tagIds);
    }

    if (coverImageTempId) {
      story.coverImage = await this.replaceCoverImage(
        story.coverImage,
        coverImageTempId,
      );
    }

    // return this.storyRepository.save(story);
    const saved = await this.storyRepository.save(story);

    await this.invalidateStoryCache(id, story.slug);

    return saved;
  }

  async remove(id: number): Promise<void> {
    const story = await this.findOne(id);

    // Xóa ảnh cover nếu có
    if (story.coverImage) {
      await this.mediaService.deleteByUrl(story.coverImage);
    }

    const result = await this.storyRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Story not found');
    }

    await this.invalidateStoryCache(id, story.slug);
  }

  async removeMany(ids: number[]): Promise<void> {
    // tìm tất cả stories theo ids
    const stories = await this.storyRepository.find({
      where: { id: In(ids) },
    });

    if (stories.length !== ids.length) {
      const foundIds = stories.map((s) => s.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));

      throw new NotFoundException(
        `Stories not found: ${missingIds.join(', ')}`,
      );
    }

    // xóa cover images
    const coverImages = stories
      .map((s) => s.coverImage)
      .filter((img): img is string => !!img);

    await Promise.all(
      coverImages.map((url) => this.mediaService.deleteByUrl(url)),
    );

    // xóa nhiều story
    await this.storyRepository.delete(ids);

    // Xóa cache từng entity (id + slug) + list
    await Promise.all(
      stories.map((s) =>
        Promise.all([
          this.cacheService.del(this.CacheKeys.story(s.id)),
          this.cacheService.del(this.CacheKeys.storySlug(s.slug)),
        ]),
      ),
    );
    await this.invalidateListCache();
  }

  // ─── Read operations ─────────────────────────────────────────────────────

  async findAll(queryDto: QueryStoryDto): Promise<PaginatedResponseDto<Story>> {
    const cacheKey = this.CacheKeys.storyQuery(queryDto);

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const {
          search,
          status,
          progress,
          tagIds,
          sortBy,
          sortOrder,
          page,
          limit,
          endDate,
          startDate,
          timezone,
        } = queryDto;

        let queryBuilder = this.storyRepository.createQueryBuilder(
          this.ENTITY_ALIAS,
        );

        queryBuilder.leftJoinAndSelect(`${this.ENTITY_ALIAS}.tags`, 'tags');

        queryBuilder = QueryBuilderHelper.applySearch(
          queryBuilder,
          this.ENTITY_ALIAS,
          search,
          STORY_SEARCHABLE_COLUMNS,
        );

        const { utcEndDate, utcStartDate } = createDateRangeInUTC({
          timezone,
          endDate,
          startDate,
        });
        queryBuilder = QueryBuilderHelper.applyDateRange(
          queryBuilder,
          this.ENTITY_ALIAS,
          'updatedAt',
          utcStartDate,
          utcEndDate,
        );

        queryBuilder = QueryBuilderHelper.applySorting(
          queryBuilder,
          this.ENTITY_ALIAS,
          sortBy,
          sortOrder,
          STORY_SORTABLE_COLUMNS,
        );

        queryBuilder = QueryBuilderHelper.applyPagination(
          queryBuilder,
          page,
          limit,
        );

        if (status) {
          queryBuilder.andWhere(`${this.ENTITY_ALIAS}.status = :status`, {
            status,
          });
        }

        if (progress) {
          queryBuilder.andWhere(`${this.ENTITY_ALIAS}.progress = :progress`, {
            progress,
          });
        }

        if (tagIds?.length) {
          queryBuilder.andWhere(`tags.id IN (:...tagIds)`, { tagIds });
        }

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
          data,
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      },
      this.TTL.list,
    );
  }

  async findHomepage(
    query: HomeStoryQueryDto,
  ): Promise<PaginatedResponseDto<Story>> {
    const cacheKey = this.CacheKeys.homepageQuery(query);

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const { search, page, limit, tags } = query;

        const qb = this.storyRepository
          .createQueryBuilder('story')
          .leftJoin('story.tags', 'tags')
          .where('story.status = :storyStatus', {
            storyStatus: StoryStatus.PUBLISHED,
          })
          .andWhere('story.lastAddedChapterDate IS NOT NULL');

        if (tags?.length) {
          qb.andWhere('tags.slug IN (:...tags)', { tags });
        }

        QueryBuilderHelper.applySearch(
          qb,
          'story',
          search,
          STORY_SEARCHABLE_COLUMNS,
        );

        qb.orderBy('story.lastAddedChapterDate', 'DESC');

        QueryBuilderHelper.applyPagination(qb, page, limit);

        const [stories, total] = await qb.getManyAndCount();

        const storyIds = stories.map((s) => s.id);

        const data = await this.storyRepository.find({
          where: { id: In(storyIds) },
          relations: {
            tags: true,
            chapters: true,
          },
          order: {
            chapters: {
              chapterNumber: 'DESC',
            },
          },
        });

        return {
          data,
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      },
      this.TTL.homepage,
    );
  }

  /**
   * Lấy danh sách hot stories với time decay
   * Cache TTL ngắn hơn vì hot score thay đổi theo thời gian thực.
   */
  async findHotStories(
    query: HotStoryQueryDto,
  ): Promise<PaginatedResponseDto<Story>> {
    const { limit = 10 } = query;
    const cacheKey = this.CacheKeys.hotStories(limit);

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const {
          HALF_LIFE_HOURS,
          RATING_AVERAGE_WEIGHT,
          RATING_COUNT_WEIGHT,
          COMMENT_COUNT_WEIGHT,
          VIEW_COUNT_WEIGHT,
        } = HOT_STORY_CONFIG;

        let queryBuilder = this.storyRepository
          .createQueryBuilder(this.ENTITY_ALIAS)
          .leftJoinAndSelect(`${this.ENTITY_ALIAS}.tags`, 'tags')
          .where(`${this.ENTITY_ALIAS}.status = :storyStatus`, {
            storyStatus: StoryStatus.PUBLISHED,
          })
          .andWhere(`${this.ENTITY_ALIAS}.lastAddedChapterDate IS NOT NULL`);

        queryBuilder.addSelect(
          `(
            (${this.ENTITY_ALIAS}.averageRating * ${RATING_AVERAGE_WEIGHT}) +
            (ln(${this.ENTITY_ALIAS}.ratingCount + 1) * ${RATING_COUNT_WEIGHT}) +
            (ln(${this.ENTITY_ALIAS}.commentCount + 1) * ${COMMENT_COUNT_WEIGHT}) +
            (ln(${this.ENTITY_ALIAS}.viewCount + 1) * ${VIEW_COUNT_WEIGHT})
          ) *
          power(
            0.5,
            extract(epoch from (now() - ${this.ENTITY_ALIAS}.lastAddedChapterDate)) 
            / 3600 
            / ${HALF_LIFE_HOURS}
          )`,
          'hot_score',
        );

        queryBuilder.orderBy('hot_score', 'DESC');

        queryBuilder = QueryBuilderHelper.applyPagination(
          queryBuilder,
          1,
          limit,
        );

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
          data,
          page: 1,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      },
      this.TTL.list,
    );
  }

  async getStats(): Promise<StoryStatsResponseDto> {
    return this.cacheService.getOrSet(
      this.CacheKeys.storyStats(),
      async () => {
        const stats = await this.storyRepository
          .createQueryBuilder(this.ENTITY_ALIAS)
          .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN progress = :ongoing THEN 1 ELSE 0 END) as ongoing',
            'SUM(CASE WHEN progress = :completed THEN 1 ELSE 0 END) as completed',
            'SUM(CASE WHEN progress = :hiatus THEN 1 ELSE 0 END) as hiatus',
          ])
          .setParameters({
            ongoing: StoryProgress.ONGOING,
            completed: StoryProgress.COMPLETED,
            hiatus: StoryProgress.HIATUS,
          })
          .getRawOne();

        return {
          total: parseInt(stats.total, 10),
          ongoing: parseInt(stats.ongoing || '0', 10),
          completed: parseInt(stats.completed || '0', 10),
          hiatus: parseInt(stats.hiatus || '0', 10),
        };
      },
      this.TTL.list,
    );
  }

  async findOne(id: number): Promise<Story> {
    return this.cacheService.getOrSet(
      this.CacheKeys.story(id),
      async () => {
        const story = await this.storyRepository.findOne({
          where: { id },
          relations: ['tags'],
        });

        if (!story) {
          throw new NotFoundException('Story not found');
        }

        return story;
      },
      this.TTL.single,
    );
  }

  async findBySlug(slug: string, direction: SortDirections): Promise<Story> {
    // Key bao gồm direction vì cùng slug có thể query với sort khác nhau
    const cacheKey = `${this.CacheKeys.storySlug(slug)}:${direction}`;

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const story = await this.storyRepository
          .createQueryBuilder(this.ENTITY_ALIAS)
          .leftJoinAndSelect(`${this.ENTITY_ALIAS}.tags`, 'tags')
          .leftJoinAndSelect(
            'story.chapters',
            'chapter',
            'chapter.status = :status',
            { status: ChapterStatus.PUBLISHED },
          )
          .where(`${this.ENTITY_ALIAS}.status = :storyStatus`, {
            storyStatus: StoryStatus.PUBLISHED,
          })
          .andWhere(`${this.ENTITY_ALIAS}.slug = :slug`, { slug })
          .andWhere(`${this.ENTITY_ALIAS}.lastAddedChapterDate IS NOT NULL`)
          .addOrderBy('chapter.chapterNumber', direction)
          .getOne();

        if (!story) {
          throw new NotFoundException('Story not found');
        }

        return story;
      },
      this.TTL.single,
    );
  }

  // ─── Excel ───────────────────────────────────────────────────────────────

  async exportExcel(): Promise<Buffer> {
    const data = await this.storyRepository.find({ relations: ['tags'] });
    return this.excelService.export(data, STORY_EXCEL_COLUMNS, {
      sheetName: 'Stories',
    });
  }

  async importExcel(
    buffer: Buffer,
  ): Promise<{ imported: number; errors: any[] }> {
    const { data, errors } = await this.excelService.import<Story>(
      buffer,
      STORY_EXCEL_COLUMNS,
    );

    if (errors.length) {
      throw new BadRequestException({ message: 'Validation errors', errors });
    }

    let imported = 0;
    const importErrors: any[] = [];

    for (const [index, row] of data.entries()) {
      try {
        // `tags` từ Excel là string[] (tên tag), cần resolve sang Tag entity
        const tagNames = (row as any).tags as string[] | undefined;
        let tagIds: number[] = [];

        if (tagNames?.length) {
          const tags = await this.tagsService.findBy({ name: In(tagNames) }); // xem note bên dưới
          tagIds = tags.map((t) => t.id);
        }

        await this.create(
          {
            title: row.title!,
            slug: row.slug!,
            authorName: row.authorName,
            description: row.description,
            status: row.status ?? StoryStatus.DRAFT,
            progress: row.progress ?? StoryProgress.ONGOING,
            tagIds,
          } as CreateStoryDto,
          row.coverImage || undefined,
        );

        imported++;
      } catch (e: any) {
        // bỏ qua lỗi duplicate slug v.v, hoặc push vào errors nếu muốn
        importErrors.push({
          row: index + 2, // +2 vì row 1 là header
          messages: [e.message],
        });
      }
    }

    return { imported, errors: importErrors };
  }

  // ─── Cache invalidation helpers ──────────────────────────────────────────

  /**
   * Xóa tất cả list cache: query, homepage, hot stories, stats.
   * Gọi sau mỗi thao tác write ảnh hưởng đến danh sách.
   */
  private async invalidateListCache() {
    await Promise.all([
      this.cacheService.deleteByPattern(this.CacheKeys.storyQueries()),
      this.cacheService.deleteByPattern(this.CacheKeys.homepageQueries()),
      this.cacheService.del(this.CacheKeys.storyStats()),
      // Hot stories cache: xóa các key phổ biến (limit 5, 10, 20)
      // Nếu CacheService hỗ trợ pattern thì dùng 'story:hot:*' thay thế
      this.cacheService.del(this.CacheKeys.hotStories(5)),
      this.cacheService.del(this.CacheKeys.hotStories(10)),
      this.cacheService.del(this.CacheKeys.hotStories(20)),
    ]);
  }

  /**
   * Xóa cache của một story cụ thể (by id + slug) + toàn bộ list cache.
   */
  private async invalidateStoryCache(id: number, slug?: string) {
    await Promise.all([
      this.cacheService.del(this.CacheKeys.story(id)),
      slug
        ? this.cacheService.deleteByPattern(
            `${this.CacheKeys.storySlug(slug)}:*`,
          )
        : Promise.resolve(),
    ]);
    await this.invalidateListCache();
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private async validateAndGetTags(tagIds: number[]) {
    const uniqueTagIds = [...new Set(tagIds)];

    const tags = await this.tagsService.findBy({
      id: In(uniqueTagIds),
    });

    if (tags.length !== uniqueTagIds.length) {
      throw new BadRequestException('Some tags not found');
    }

    return tags;
  }

  private async handleCoverImageTemp(tempId: string): Promise<string> {
    const media = await this.mediaService.publishMedia(
      tempId,
      MediaUsage.STORY_COVER,
    );

    return media.url;
  }

  private async replaceCoverImage(
    oldUrl: string | null,
    tempId: string,
  ): Promise<string> {
    const media = await this.mediaService.publishMedia(
      tempId,
      MediaUsage.STORY_COVER,
    );

    if (oldUrl) {
      await this.mediaService.deleteByUrl(oldUrl);
    }

    return media.url;
  }

  private async checkUniqueFields(data: { slug?: string }, ignoreId?: number) {
    if (data.slug) {
      const existingBySlug = await this.storyRepository.findOne({
        where: { slug: data.slug },
      });
      if (existingBySlug && (!ignoreId || existingBySlug.id !== ignoreId)) {
        throw new ConflictException(
          `Story with slug '${data.slug}' already exists`,
        );
      }
    }
  }

  private normalizeSlug(data: { title?: string; slug?: string }) {
    if (data.slug) {
      data.slug = toSlug(data.slug);
    }
  }
}
