import {
  createDateRangeInUTC,
  PaginatedResponseDto,
  QueryBuilderHelper,
  toSlug,
} from '@/common';
import { ExcelService } from '@/modules/common/excel/excel.service';
import { MediaUsage } from '@/modules/media/constants/media.constants';
import { MediaService } from '@/modules/media/media.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { BookmarkService } from '../bookmark/bookmark.service';
import { CacheService } from '../common/cache/cache.service';
import { ReadingHistoryService } from '../reading-history/reading-history.service';
import { StoryViewDailyService } from '../story-view-daily/story-view-daily.service';
import { Story } from '../story/entities/story.entity';
import { StoryService } from '../story/story.service';
import {
  CHAPTER_EXCEL_COLUMNS,
  CHAPTER_SEARCHABLE_COLUMNS,
  CHAPTER_SORTABLE_COLUMNS,
  ChapterExcelRow,
} from './constants/chapter.constants';
import {
  CreateChapterContentDto,
  CreateChapterDto,
  UpdateChapterDto,
  UpdateChapterStatusDto,
} from './dto';
import { FindChaptersByStoryDto } from './dto/find-chapters-by-story.dto';
import { ChapterContent, ContentType } from './entities/chapter-content';
import { Chapter, ChapterStatus } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  private readonly ENTITY_ALIAS = 'chapter';

  private readonly CacheKeys = {
    chapters: () => 'chapters:*',
    chapter: (id: number) => `chapter:${id}`,
    chapterBySlug: (storySlug: string, chapterNumber: number) =>
      `chapter:slug:${storySlug}:${chapterNumber}`,
    chaptersByStory: (storyId: number) => `chapters:story:${storyId}:all`,
    chaptersByStoryQueries: (storyId: number) =>
      `chapters:story:${storyId}:query:*`,
    chaptersByStoryQuery: (storyId: number, query: FindChaptersByStoryDto) =>
      this.cacheService.buildKey(`chapters:story:${storyId}:query`, query),
  };

  private readonly TTL = {
    single: 600_000, // 10 phút cho từng chapter
    list: 600_000, // 10 phút cho danh sách / query
  };

  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    private readonly mediaService: MediaService,
    private readonly bookmarkService: BookmarkService,
    private readonly readingHistoryService: ReadingHistoryService,
    private readonly storyService: StoryService,
    private readonly storyViewDailyService: StoryViewDailyService,
    private readonly excelService: ExcelService,
    private readonly cacheService: CacheService,
  ) {}

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    this.normalizeSlug(createChapterDto);
    return await this.chapterRepository.manager.transaction(async (manager) => {
      const { contents, storyId, ...rest } = createChapterDto;

      const publishedAt = this.updatePublishedAt(rest.status);

      // Tạo chapter
      const chapter = manager.create(Chapter, {
        ...rest,
        story: { id: storyId },
        publishedAt,
      });

      // Xử lý contents (nếu có)
      if (contents?.length) {
        const { contents: newContents } = await this.buildChapterContents(
          contents,
          manager,
        );

        chapter.contents = newContents;
      } else {
        chapter.contents = [];
      }

      // return await manager.save(chapter);
      const savedChapter = await manager.save(chapter);

      // ✅ Cập nhật lastAddedChapterDate của story
      await manager.update(Story, storyId, {
        lastAddedChapterDate: new Date(),
      });

      await this.invalidateStoryChapterListCache(
        savedChapter.story?.id ?? createChapterDto.storyId,
      );

      return savedChapter;
    });
  }

  async update(
    id: number,
    updateChapterDto: UpdateChapterDto,
  ): Promise<Chapter> {
    this.normalizeSlug(updateChapterDto);
    let oldStoryId: number | undefined;
    const saved = await this.chapterRepository.manager.transaction(
      async (manager) => {
        const chapter = await manager.findOne(Chapter, {
          where: { id },
          relations: ['contents', 'story'],
        });

        if (!chapter) {
          throw new NotFoundException('Chapter not found');
        }

        oldStoryId = chapter.story?.id;

        const oldStatus = chapter.status;
        const oldImageUrls = chapter.contents
          .filter((content) => content.imageUrl) // Chỉ lấy những content có imageUrl
          .map((content) => content.imageUrl!)
          .filter((url) => url); // Lọc bỏ URL rỗng

        // Cập nhật các thuộc tính cơ bản của chapter
        const { contents, storyId, ...rest } = updateChapterDto;
        Object.assign(chapter, rest);

        // ✅ Chỉ update publishedAt khi status CÓ thay đổi
        if (rest.status && rest.status !== oldStatus) {
          chapter.publishedAt = this.updatePublishedAt(rest.status);
        }

        // Nếu có contents trong DTO, xóa hết contents cũ và tạo mới
        if (contents !== undefined) {
          await manager.delete(ChapterContent, { chapterId: id });

          const { contents: newContents, imageUrls: newImageUrls } =
            await this.buildChapterContents(contents, manager, id);

          chapter.contents = newContents;

          // Xóa các ảnh cũ không còn được sử dụng
          const urlsToDelete = oldImageUrls.filter(
            (url) => !newImageUrls.includes(url),
          );
          await this.safeDeleteMedia(urlsToDelete);
        }

        // Lưu chapter và contents mới
        return await manager.save(chapter);
      },
    );

    // await this.invalidateChapterCache(id, oldStoryId);
    await this.cacheService.deleteByPattern(this.CacheKeys.chapters());
    await this.cacheService.deleteByPattern('chapter:*');

    return saved;
  }

  async findOne(id: number): Promise<Chapter> {
    return this.cacheService.getOrSet(
      this.CacheKeys.chapter(id),
      async () => {
        const chapter = await this.chapterRepository.findOne({
          where: { id },
          relations: ['contents'],
          order: {
            contents: {
              position: 'ASC',
            },
          },
        });

        if (!chapter) {
          throw new NotFoundException('Chapter not found');
        }

        return chapter;
      },
      this.TTL.single,
    );
  }

  async findByStoryId(
    storyId: number,
    query: FindChaptersByStoryDto,
  ): Promise<PaginatedResponseDto<Chapter>> {
    const cacheKey = this.CacheKeys.chaptersByStoryQuery(storyId, query);

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const {
          search,
          status,
          sortBy,
          sortOrder,
          page,
          limit,
          endDate,
          startDate,
          timezone,
        } = query;

        let queryBuilder = this.chapterRepository
          .createQueryBuilder(this.ENTITY_ALIAS)
          .leftJoin(`${this.ENTITY_ALIAS}.story`, 'story')
          .where('story.id = :storyId', { storyId });

        queryBuilder = QueryBuilderHelper.applySearch(
          queryBuilder,
          this.ENTITY_ALIAS,
          search,
          CHAPTER_SEARCHABLE_COLUMNS,
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

        if (status) {
          queryBuilder.andWhere(`${this.ENTITY_ALIAS}.status = :status`, {
            status,
          });
        }

        queryBuilder = QueryBuilderHelper.applySorting(
          queryBuilder,
          this.ENTITY_ALIAS,
          sortBy,
          sortOrder,
          CHAPTER_SORTABLE_COLUMNS,
        );

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
      },
      this.TTL.list,
    );
  }

  async remove(id: number) {
    const chapter = await this.findOne(id);
    const storyId = chapter.story?.id;

    await this.chapterRepository.manager.transaction(async (manager) => {
      await this.removeChapterLogic(manager, id);
    });

    await this.invalidateChapterCache(id, storyId);
  }

  async removeMany(ids: number[]) {
    ids = [...new Set(ids)];

    await this.chapterRepository.manager.transaction(async (manager) => {
      // Check tất cả chapter tồn tại
      const chapters = await manager.find(Chapter, {
        where: { id: In(ids) },
        select: ['id'],
      });

      if (chapters.length !== ids.length) {
        const foundIds = chapters.map((c) => c.id);
        const missingIds = ids.filter((id) => !foundIds.includes(id));

        throw new NotFoundException(
          `Chapters not found: ${missingIds.join(', ')}`,
        );
      }

      for (const id of ids) {
        await this.removeChapterLogic(manager, id);
      }
    });

    await this.cacheService.deleteByPattern(this.CacheKeys.chapters());
    await this.cacheService.deleteByPattern('chapter:*');
  }

  async updateStatus(
    id: number,
    updateChapterStatusDto: UpdateChapterStatusDto,
  ) {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ['story'],
    });

    if (!chapter) throw new NotFoundException('Chapter not found');

    const { status } = updateChapterStatusDto;

    if (status && status !== chapter.status) {
      chapter.status = status;
      chapter.publishedAt = this.updatePublishedAt(status);
    }

    // return this.chapterRepository.save(chapter);
    const saved = await this.chapterRepository.save(chapter);

    await this.invalidateChapterCache(id, chapter.story?.id);

    return saved;
  }

  /**
   * Find chapter by story slug and chapter number
   * Useful for SEO-friendly URLs
   * @param storySlug - Story slug (unique identifer)
   * @param chapterNumber - Chapter number (e.g., 1, 2, 3)
   * @param userId - Optional user ID for updating reading data
   * @returns Chapter with contents and story
   */
  async findByStorySlugAndChapterNumber(
    storySlug: string,
    chapterNumber: number,
    userId?: string,
  ): Promise<Chapter> {
    const chapter = await this.cacheService.getOrSet(
      this.CacheKeys.chapterBySlug(storySlug, chapterNumber),
      async () => {
        const found = await this.chapterRepository.findOne({
          where: {
            chapterNumber,
            story: {
              slug: storySlug,
            },
          },
          relations: ['contents', 'story'],
          order: {
            contents: {
              position: 'ASC',
            },
          },
        });

        if (!found) {
          throw new NotFoundException(
            `Chapter ${chapterNumber} not found for story: ${storySlug}`,
          );
        }

        return found;
      },
      this.TTL.single,
    );

    // ✅ Side-effects NGOÀI cache (không cache kết quả của các action này)
    this.storyService.incrementViewCount(chapter.story.id).catch((error) => {
      console.error('Failed to increment view count:', error);
    });

    this.storyViewDailyService.recordView(chapter.story.id);

    if (userId) {
      try {
        await this.readingHistoryService.addHistory(
          userId,
          chapter.story.id,
          chapter.id,
        );

        await this.bookmarkService.updateLastReadChapter(
          userId,
          chapter.story.id,
          chapter.id,
        );
      } catch (error) {
        console.error('Failed to update reading data:', error);
      }
    }

    return chapter;
  }

  // ─── CACHE INVALIDATION ───────────────────────────────────────────────────────

  /**
   * Xóa cache danh sách chapters của một story (query + all).
   */
  private async invalidateStoryChapterListCache(storyId?: number) {
    if (!storyId) return;
    await this.cacheService.del(this.CacheKeys.chaptersByStory(storyId));
    await this.cacheService.deleteByPattern(
      this.CacheKeys.chaptersByStoryQueries(storyId),
    );
  }

  /**
   * Xóa cache của một chapter cụ thể + list cache của story.
   */
  private async invalidateChapterCache(id: number, storyId?: number) {
    await this.cacheService.del(this.CacheKeys.chapter(id));
    await this.invalidateStoryChapterListCache(storyId);
  }

  // ─── EXPORT ───────────────────────────────────────────────────────────────────

  /**
   * Export tất cả chapter (cùng contents) của 1 story ra file Excel.
   * Mỗi content block là 1 row. Các field chapter lặp lại trên mỗi row.
   *
   * @param storyId - ID của story cần export
   */
  async exportByStoryId(storyId: number): Promise<Buffer> {
    const chapters = await this.chapterRepository.find({
      where: { story: { id: storyId } },
      relations: ['contents'],
      order: { chapterNumber: 'ASC', contents: { position: 'ASC' } },
    });

    if (!chapters.length) {
      // Trả về file Excel rỗng (chỉ có header) nếu story chưa có chapter
      return this.excelService.export<ChapterExcelRow>(
        [],
        CHAPTER_EXCEL_COLUMNS,
        { sheetName: 'Chapters' },
      );
    }

    // Flatten: mỗi content block → 1 row
    const rows: ChapterExcelRow[] = [];

    for (const chapter of chapters) {
      if (!chapter.contents?.length) {
        // Chapter không có content → vẫn xuất 1 row để giữ thông tin chapter
        rows.push({
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          slug: chapter.slug,
          status: chapter.status,
          contentType: ContentType.TEXT,
          textContent: undefined,
          imageUrl: undefined,
        });
        continue;
      }

      for (const content of chapter.contents) {
        rows.push({
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          slug: chapter.slug,
          status: chapter.status,
          contentType: content.contentType,
          textContent: content.textContent,
          imageUrl: content.imageUrl,
        });
      }
    }

    return this.excelService.export<ChapterExcelRow>(
      rows,
      CHAPTER_EXCEL_COLUMNS,
      {
        sheetName: 'Chapters',
      },
    );
  }

  // ─── IMPORT ───────────────────────────────────────────────────────────────────

  /**
   * Import chapter từ file Excel vào story chỉ định.
   * - Group các row theo chapterNumber.
   * - Mỗi nhóm → tạo 1 Chapter + nhiều ChapterContent.
   * - Skip chapter đã tồn tại (theo chapterNumber + storyId), ghi vào importErrors.
   *
   * @param storyId - ID của story sẽ nhận chapter mới
   * @param buffer  - Buffer của file .xlsx
   */
  async importFromBuffer(
    storyId: number,
    buffer: Buffer,
  ): Promise<{ imported: number; skipped: number; errors: any[] }> {
    // 1️⃣ Validate story tồn tại
    await this.storyService.findOne(storyId);

    // 2️⃣ Parse Excel
    const { data, errors } = await this.excelService.import<ChapterExcelRow>(
      buffer,
      CHAPTER_EXCEL_COLUMNS,
    );

    if (errors.length) {
      throw new BadRequestException({ message: 'Validation errors', errors });
    }

    // 3️⃣ Group rows theo chapterNumber
    const chapterMap = new Map<number, ChapterExcelRow[]>();

    for (const row of data) {
      const num = row.chapterNumber as number;
      if (num == null || isNaN(num)) continue;

      if (!chapterMap.has(num)) {
        chapterMap.set(num, []);
      }
      chapterMap.get(num)!.push(row as ChapterExcelRow);
    }

    // 4️⃣ Lấy danh sách chapterNumber đã tồn tại trong story
    const existingChapters = await this.chapterRepository.find({
      where: { story: { id: storyId } },
      select: ['chapterNumber'],
    });
    const existingNumbers = new Set(
      existingChapters.map((c) => c.chapterNumber),
    );

    // 5️⃣ Tạo chapter trong transaction
    const importErrors: any[] = [];
    let imported = 0;
    let skipped = 0;

    await this.chapterRepository.manager.transaction(async (manager) => {
      for (const [chapterNumber, rows] of chapterMap.entries()) {
        // Skip nếu chapterNumber đã tồn tại
        if (existingNumbers.has(chapterNumber)) {
          skipped++;
          importErrors.push({
            chapterNumber,
            messages: [
              `Chapter ${chapterNumber} already exists in this story — skipped`,
            ],
          });
          continue;
        }

        // Lấy metadata từ row đầu tiên của nhóm
        const firstRow = rows[0];
        const title = firstRow.title ?? `Chapter ${chapterNumber}`;
        const slug = firstRow.slug ? toSlug(firstRow.slug) : toSlug(title);
        const status = firstRow.status ?? ChapterStatus.DRAFT;
        const publishedAt = this.updatePublishedAt(status);

        try {
          // Build contents
          const contents: ChapterContent[] = rows
            .filter(
              (r) =>
                r.contentType === ContentType.IMAGE
                  ? !!r.imageUrl // image row phải có imageUrl
                  : r.textContent != null, // text row phải có textContent
            )
            .map((r, position) =>
              manager.create(ChapterContent, {
                position,
                contentType: r.contentType ?? ContentType.TEXT,
                textContent: r.textContent,
                imageUrl: r.imageUrl,
              }),
            );

          const chapter = manager.create(Chapter, {
            title,
            slug,
            chapterNumber,
            status,
            publishedAt,
            story: { id: storyId },
            contents,
          });

          await manager.save(chapter);
          imported++;
        } catch (e: any) {
          importErrors.push({
            chapterNumber,
            messages: [e.message ?? 'Unknown error'],
          });
        }
      }

      // ✅ Cập nhật lastAddedChapterDate nếu có chapter được import
      if (imported > 0) {
        await manager.update(Story, storyId, {
          lastAddedChapterDate: new Date(),
        });
      }
    });

    return { imported, skipped, errors: importErrors };
  }

  // ─── PRIVATE HELPERS ──────────────────────────────────────────────────────────

  private async buildChapterContents(
    contentsDto: CreateChapterContentDto[],
    manager: EntityManager,
    chapterId?: number,
  ) {
    const contents: ChapterContent[] = [];
    const imageUrls: string[] = [];

    for (let i = 0; i < contentsDto.length; i++) {
      const dto = contentsDto[i];
      let imageUrl = dto.imageUrl;

      if (dto.imageTempId) {
        const media = await this.mediaService.publishMedia(
          dto.imageTempId,
          MediaUsage.CHAPTER_IMAGE,
        );
        imageUrl = media.url;
      }

      if (imageUrl) imageUrls.push(imageUrl);

      contents.push(
        manager.create(ChapterContent, {
          ...dto,
          imageUrl,
          position: i,
          chapterId,
        }),
      );
    }

    return { contents, imageUrls };
  }

  private async safeDeleteMedia(urls: string[]) {
    await Promise.all(
      urls.map((url) =>
        this.mediaService.deleteByUrl(url).catch((err) => {
          console.error(`Delete failed: ${url}`, err);
        }),
      ),
    );
  }

  private async removeChapterLogic(manager: EntityManager, id: number) {
    const chapter = await manager.findOne(Chapter, {
      where: { id },
      relations: ['contents'],
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    // Lấy danh sách ảnh cần xóa
    const imageUrls = chapter.contents
      .map((content) => content.imageUrl)
      .filter((url): url is string => !!url);

    // Xóa chapter (cascade sẽ xóa contents)
    await manager.remove(chapter);

    // Xóa media (không throw lỗi để tránh rollback)
    await this.safeDeleteMedia(imageUrls);
  }

  private normalizeSlug(data: { title?: string; slug?: string }) {
    if (data.slug) {
      data.slug = toSlug(data.slug);
    }
  }

  private updatePublishedAt(status?: ChapterStatus) {
    if (status === ChapterStatus.PUBLISHED) {
      return new Date();
    }
    return null;
  }
}
