import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MediaUsage } from '../media/constants/media.constants';
import { MediaService } from '../media/media.service';
import { TagsService } from '../tags/tags.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    private readonly tagsService: TagsService,
    private readonly mediaService: MediaService,
  ) {}
  async create(createStoryDto: CreateStoryDto): Promise<Story> {
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

  async findAll(): Promise<Story[]> {
    return this.storyRepository.find({
      relations: ['tags'],
    });
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
    const { tagIds, coverImageTempId, ...rest } = updateStoryDto;

    const story = await this.findOne(id);

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
}
