import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    await this.checkUniqueFields(createGenreDto);
    const newGenre = this.genreRepository.create(createGenreDto);
    return await this.genreRepository.save(newGenre);
  }

  async findAll(): Promise<Genre[]> {
    return await this.genreRepository.find();
  }

  async findOne(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);
    await this.checkUniqueFields(updateGenreDto, id);
    Object.assign(genre, updateGenreDto);
    return await this.genreRepository.save(genre);
  }

  async remove(id: number): Promise<void> {
    const genre = await this.findOne(id);
    await this.genreRepository.remove(genre);
  }

  private async checkUniqueFields(data: { name?: string; slug?: string }, ignoreId?: number) {
    if (data.name) {
      const existingByName = await this.genreRepository.findOne({
        where: { name: data.name },
      });
      if (existingByName && (!ignoreId || existingByName.id !== ignoreId)) {
        throw new ConflictException(`Genre with name '${data.name}' already exists`);
      }
    }

    if (data.slug) {
      const existingBySlug = await this.genreRepository.findOne({
        where: { slug: data.slug },
      });
      if (existingBySlug && (!ignoreId || existingBySlug.id !== ignoreId)) {
        throw new ConflictException(`Genre with slug '${data.slug}' already exists`);
      }
    }
  }
}
