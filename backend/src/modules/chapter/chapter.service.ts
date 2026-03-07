import { toSlug } from '@/common';
import { MediaUsage } from '@/modules/media/constants/media.constants';
import { MediaService } from '@/modules/media/media.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateChapterContentDto,
  CreateChapterDto,
  UpdateChapterDto,
  UpdateChapterStatusDto,
} from './dto';
import { ChapterContent } from './entities/chapter-content';
import { Chapter, ChapterStatus } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    this.normalizeSlug(createChapterDto);
    return await this.chapterRepository.manager.transaction(async (manager) => {
      const { contents, storyId, ...rest } = createChapterDto;

      // Tạo chapter
      const chapter = manager.create(Chapter, {
        ...rest,
        story: { id: storyId },
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

      const oldImageUrls = chapter.contents
        .filter((content) => content.imageUrl) // Chỉ lấy những content có imageUrl
        .map((content) => content.imageUrl!)
        .filter((url) => url); // Lọc bỏ URL rỗng

      // Cập nhật các thuộc tính cơ bản của chapter
      const { contents, storyId, ...rest } = updateChapterDto;
      Object.assign(chapter, rest);

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

  async remove(id: number) {
    return await this.chapterRepository.manager.transaction(async (manager) => {
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
    });
  }

  async updateStatus(
    id: number,
    updateChapterStatusDto: UpdateChapterStatusDto,
  ) {
    const chapter = await this.chapterRepository.findOne({ where: { id } });

    if (!chapter) throw new NotFoundException('Chapter not found');

    const { status } = updateChapterStatusDto;

    // Business rules
    if (status === ChapterStatus.PUBLISHED) {
      chapter.publishedAt = new Date();
    }

    if (status === ChapterStatus.DRAFT) {
      chapter.publishedAt = undefined;
    }

    chapter.status = status;

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

  private normalizeSlug(data: { title?: string; slug?: string }) {
    if (data.slug) {
      data.slug = toSlug(data.slug);
    }
  }
}
