import {
  createDateRangeInUTC,
  PaginatedResponseDto,
  QueryBuilderHelper,
  toSlug,
} from '@/common';
import { MediaUsage } from '@/modules/media/constants/media.constants';
import { MediaService } from '@/modules/media/media.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import {
  CHAPTER_SEARCHABLE_COLUMNS,
  CHAPTER_SORTABLE_COLUMNS,
} from './constants/chapter.constants';
import {
  CreateChapterContentDto,
  CreateChapterDto,
  UpdateChapterDto,
  UpdateChapterStatusDto,
} from './dto';
import { FindChaptersByStoryDto } from './dto/find-chapters-by-story.dto';
import { ChapterContent } from './entities/chapter-content';
import { Chapter, ChapterStatus } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  private readonly ENTITY_ALIAS = 'chapter';

  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    private readonly mediaService: MediaService,
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

      return await manager.save(chapter);
    });
  }

  async update(
    id: number,
    updateChapterDto: UpdateChapterDto,
  ): Promise<Chapter> {
    this.normalizeSlug(updateChapterDto);
    return await this.chapterRepository.manager.transaction(async (manager) => {
      const chapter = await manager.findOne(Chapter, {
        where: { id },
        relations: ['contents'],
      });

      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }

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
    });
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ['contents'], // nếu cần story
      order: {
        contents: {
          position: 'ASC', // giữ đúng thứ tự
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }

  async findByStoryId(
    storyId: number,
    query: FindChaptersByStoryDto,
  ): Promise<PaginatedResponseDto<Chapter>> {
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

    // Apply search using helper
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

    // business filters
    if (status) {
      queryBuilder.andWhere(`${this.ENTITY_ALIAS}.status = :status`, {
        status,
      });
    }

    // Apply sorting using helper
    queryBuilder = QueryBuilderHelper.applySorting(
      queryBuilder,
      this.ENTITY_ALIAS,
      sortBy,
      sortOrder,
      CHAPTER_SORTABLE_COLUMNS,
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

  // async remove(id: number) {
  //   return await this.chapterRepository.manager.transaction(async (manager) => {
  //     const chapter = await manager.findOne(Chapter, {
  //       where: { id },
  //       relations: ['contents'],
  //     });

  //     if (!chapter) {
  //       throw new NotFoundException('Chapter not found');
  //     }

  //     // Lấy danh sách ảnh cần xóa
  //     const imageUrls = chapter.contents
  //       .map((content) => content.imageUrl)
  //       .filter((url): url is string => !!url);

  //     // Xóa chapter (cascade sẽ xóa contents)
  //     await manager.remove(chapter);

  //     // Xóa media (không throw lỗi để tránh rollback)
  //     await this.safeDeleteMedia(imageUrls);
  //   });
  // }

  async remove(id: number) {
    return this.chapterRepository.manager.transaction(async (manager) => {
      await this.removeChapterLogic(manager, id);
    });
  }

  async removeMany(ids: number[]) {
    ids = [...new Set(ids)];

    return this.chapterRepository.manager.transaction(async (manager) => {
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
  }

  async updateStatus(
    id: number,
    updateChapterStatusDto: UpdateChapterStatusDto,
  ) {
    const chapter = await this.chapterRepository.findOne({ where: { id } });

    if (!chapter) throw new NotFoundException('Chapter not found');

    const { status } = updateChapterStatusDto;

    if (status && status !== chapter.status) {
      chapter.status = status;
      chapter.publishedAt = this.updatePublishedAt(status);
    }

    return this.chapterRepository.save(chapter);
  }

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
