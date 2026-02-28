import {
  PaginatedResponseDto,
  QueryBaseDto,
  QueryBuilderHelper,
} from '@/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-genre.dto';
import { UpdateTagDto } from './dto/update-genre.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    await this.checkUniqueFields(createTagDto);
    const newTag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(newTag);
  }

  async findAll(query: QueryBaseDto): Promise<PaginatedResponseDto<Tag>> {
    const { page, limit, skip, search, sortBy, sortOrder } = query;

    let queryBuilder = this.tagRepository.createQueryBuilder('tag');

    // Apply search using helper
    queryBuilder = QueryBuilderHelper.applySearch(queryBuilder, 'tag', search, [
      'name',
      'description',
    ]);

    // Apply sorting using helper
    queryBuilder = QueryBuilderHelper.applySorting(
      queryBuilder,
      'tag',
      sortBy,
      sortOrder,
      ['name', 'createdAt', 'updatedAt'],
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

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    await this.checkUniqueFields(updateTagDto, id);
    Object.assign(tag, updateTagDto);
    return await this.tagRepository.save(tag);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);
    return await this.tagRepository.remove(genre);
  }

  async findBy(where: FindOptionsWhere<Tag>): Promise<Tag[]> {
    return this.tagRepository.find({ where });
  }

  private async checkUniqueFields(
    data: { name?: string; slug?: string },
    ignoreId?: number,
  ) {
    if (data.name) {
      const existingByName = await this.tagRepository.findOne({
        where: { name: data.name },
      });
      if (existingByName && (!ignoreId || existingByName.id !== ignoreId)) {
        throw new ConflictException(
          `Tag with name '${data.name}' already exists`,
        );
      }
    }

    if (data.slug) {
      const existingBySlug = await this.tagRepository.findOne({
        where: { slug: data.slug },
      });
      if (existingBySlug && (!ignoreId || existingBySlug.id !== ignoreId)) {
        throw new ConflictException(
          `Tag with slug '${data.slug}' already exists`,
        );
      }
    }
  }
}
