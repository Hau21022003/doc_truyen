import {
  PaginatedResponseDto,
  QueryBaseDto,
  QueryBuilderHelper,
  toSlug,
} from '@/common';
import { ExcelService } from '@/common/excel/excel.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-genre.dto';
import { UpdateTagDto } from './dto/update-genre.dto';
import { Tag } from './entities/tag.entity';
import { TAG_EXCEL_COLUMNS } from './tag.constants';

@Injectable()
export class TagsService {
  private readonly ENTITY_ALIAS = 'tag';

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly excelService: ExcelService,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    this.normalizeSlug(createTagDto);

    await this.checkUniqueFields(createTagDto);
    const newTag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(newTag);
  }

  async query(query: QueryBaseDto): Promise<PaginatedResponseDto<Tag>> {
    const { page, limit, search, sortBy, sortOrder } = query;

    let queryBuilder = this.tagRepository.createQueryBuilder(this.ENTITY_ALIAS);

    queryBuilder.loadRelationCountAndMap(
      `${this.ENTITY_ALIAS}.storyCount`,
      `${this.ENTITY_ALIAS}.stories`,
    );

    // Apply search using helper
    queryBuilder = QueryBuilderHelper.applySearch(
      queryBuilder,
      this.ENTITY_ALIAS,
      search,
      ['name', 'slug'],
    );

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

  findAll() {
    return this.tagRepository.find();
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

    this.normalizeSlug(updateTagDto);

    await this.checkUniqueFields(updateTagDto, id);

    Object.assign(tag, updateTagDto);
    return await this.tagRepository.save(tag);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);
    return await this.tagRepository.remove(genre);
  }

  async removeMany(ids: number[]) {
    const tags = await this.tagRepository.findBy({ id: In(ids) });

    if (tags.length !== ids.length) {
      throw new NotFoundException('Some tags not found');
    }

    return this.tagRepository.remove(tags);
  }

  async findBy(where: FindOptionsWhere<Tag>): Promise<Tag[]> {
    return this.tagRepository.find({ where });
  }

  async setFeatured(tagId: number, isFeatured: boolean): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    tag.isFeatured = isFeatured;

    return await this.tagRepository.save(tag);
  }

  async exportAll(): Promise<Buffer> {
    const stories = await this.tagRepository.find();
    return this.excelService.export(stories, TAG_EXCEL_COLUMNS, {
      sheetName: 'Tags',
    });
  }

  async importFromBuffer(
    buffer: Buffer,
  ): Promise<{ imported: number; errors: any[] }> {
    const { data, errors } = await this.excelService.import<Tag>(
      buffer,
      TAG_EXCEL_COLUMNS,
    );

    if (errors.length) {
      throw new BadRequestException({ message: 'Validation errors', errors });
    }

    const importErrors: any[] = [];
    const toSave: Tag[] = [];

    for (const [index, item] of data.entries()) {
      // ✅ Normalize slug
      if (item.slug) {
        item.slug = toSlug(item.slug);
      } else if (item.name) {
        item.slug = toSlug(item.name); // auto-gen nếu không có
      }

      // ✅ Check duplicate trong DB
      try {
        await this.checkUniqueFields({ name: item.name, slug: item.slug });
        toSave.push(this.tagRepository.create(item as Partial<Tag>));
      } catch (e: any) {
        importErrors.push({
          row: index + 2, // +2 vì row 1 là header
          messages: [e.message],
        });
      }
    }

    if (toSave.length > 0) {
      await this.tagRepository.save(toSave);
    }

    return { imported: toSave.length, errors: importErrors };
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

  private normalizeSlug(data: { name?: string; slug?: string }) {
    if (data.slug) {
      data.slug = toSlug(data.slug);
    }
  }
}
