import {
  createDateRangeInUTC,
  PaginatedResponseDto,
  QueryBuilderHelper,
  toSlug,
} from '@/common';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MediaUsage } from '../media/constants/media.constants';
import { MediaService } from '../media/media.service';
import { TagsService } from '../tags/tags.service';
import {
  STORY_SEARCHABLE_COLUMNS,
  STORY_SORTABLE_COLUMNS,
} from './constants/story.constants';
import { CreateStoryDto } from './dto/create-story.dto';
import { QueryStoryDto } from './dto/query-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoryService {
  private readonly ENTITY_ALIAS = 'story';

  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    private readonly tagsService: TagsService,
    private readonly mediaService: MediaService,
  ) {}
  async create(createStoryDto: CreateStoryDto): Promise<Story> {
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

    return this.storyRepository.save(story);
  }

  async findAll(queryDto: QueryStoryDto): Promise<PaginatedResponseDto<Story>> {
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

    // Apply search using helper
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

    // Apply sorting using helper
    queryBuilder = QueryBuilderHelper.applySorting(
      queryBuilder,
      this.ENTITY_ALIAS,
      sortBy,
      sortOrder,
      STORY_SORTABLE_COLUMNS,
    );

    // Apply pagination using helper
    queryBuilder = QueryBuilderHelper.applyPagination(
      queryBuilder,
      page,
      limit,
    );

    // business filters
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
  }

  async findOne(id: number): Promise<Story> {
    const story = await this.storyRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return story;
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

    return this.storyRepository.save(story);
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
  }

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
