import { QueryBaseDto, SortDirections } from '@/common';
import { ExcelService } from '@/modules/common/excel/excel.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-genre.dto';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let tagRepository: jest.Mocked<Repository<Tag>>;
  let excelService: jest.Mocked<ExcelService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findBy: jest.fn(),
            createQueryBuilder: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: ExcelService,
          useValue: {
            export: jest.fn(),
            import: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagRepository = module.get(getRepositoryToken(Tag));
    excelService = module.get<ExcelService>(
      ExcelService,
    ) as jest.Mocked<ExcelService>;
  });

  it('should create a new tag', async () => {
    const createTagDto: CreateTagDto = { name: 'Fiction', slug: 'fiction' };
    const mockTag = {
      id: 1,
      ...createTagDto,
      createdAt: new Date(),
      isFeatured: false,
      updatedAt: new Date(),
    } as Tag;

    tagRepository.create.mockReturnValue(mockTag as any);
    tagRepository.save.mockResolvedValue(mockTag);

    const result = await service.create(createTagDto);

    expect(tagRepository.create).toHaveBeenCalledWith(createTagDto);
    expect(tagRepository.save).toHaveBeenCalledWith(mockTag);
    expect(result).toEqual(mockTag);
  });

  it('should throw ConflictException if name already exists', async () => {
    const createTagDto: CreateTagDto = { name: 'Fiction', slug: 'fiction' };
    const existingTag = { id: 1, name: 'Fiction', slug: 'fiction' };

    tagRepository.findOne.mockResolvedValue(existingTag as any);

    await expect(service.create(createTagDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should remove a tag', async () => {
    const id = 1;
    const tag = { id: 1, name: 'Fiction' };

    tagRepository.findOne.mockResolvedValue(tag as any);
    tagRepository.remove.mockResolvedValue(tag as any);

    await service.remove(id);

    expect(tagRepository.remove).toHaveBeenCalledWith(tag);
  });

  it('should throw NotFoundException if tag not found', async () => {
    tagRepository.findOne.mockResolvedValue(null);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });

  it('should query tags with pagination', async () => {
    const queryDto = {
      page: 1,
      limit: 10,
      search: '',
      sortBy: 'name',
      sortOrder: SortDirections.ASC,
    } as QueryBaseDto;
    const mockTags = [
      { id: 1, name: 'Fiction', slug: 'fiction' },
      { id: 2, name: 'Mystery', slug: 'mystery' },
    ] as Tag[];

    const mockQueryBuilder = {
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([mockTags, 2]),
    };

    tagRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

    const result = await service.query(queryDto);

    expect(result.data).toEqual(mockTags);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
