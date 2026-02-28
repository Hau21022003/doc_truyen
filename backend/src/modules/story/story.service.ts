import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
  ) {}

  async create(createStoryDto: CreateStoryDto): Promise<Story> {
    const { title, tagIds } = createStoryDto;

    const uniqueTagIds = [...new Set(tagIds)];

    const tags = await this.tagsService.findBy({
      id: In(uniqueTagIds),
    });

    if (tags.length !== uniqueTagIds.length) {
      throw new BadRequestException('Some tags not found');
    }

    const story = this.storyRepository.create({
      title,
      tags: tags,
    });

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
    const { tagIds, ...rest } = updateStoryDto;

    const story = await this.storyRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // update tất cả field thường
    Object.assign(story, rest);

    // xử lý riêng relation
    if (tagIds !== undefined) {
      const uniqueTagIds = [...new Set(tagIds)];

      const tags = await this.tagsService.findBy({
        id: In(uniqueTagIds),
      });

      if (tags.length !== uniqueTagIds.length) {
        throw new BadRequestException('Some tags not found');
      }

      story.tags = tags;
    }

    return this.storyRepository.save(story);
  }

  async remove(id: number): Promise<void> {
    const result = await this.storyRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Story not found');
    }
  }
}
