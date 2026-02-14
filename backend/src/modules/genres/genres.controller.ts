import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { QueryBaseDto } from '@/common/dto';
import { PaginatedResponseDto } from '@/common/dto';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({ status: 201, type: Genre })
  async create(@Body() createGenreDto: CreateGenreDto) {
    return await this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres with pagination' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<Genre> })
  async findAll(@Query() query: QueryBaseDto) {
    return await this.genresService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get genre by ID' })
  @ApiResponse({ status: 200, type: Genre })
  async findOne(@Param('id') id: string) {
    return await this.genresService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update genre' })
  @ApiResponse({ status: 200, type: Genre })
  async update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return await this.genresService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete genre' })
  async remove(@Param('id') id: string) {
    return await this.genresService.remove(+id);
  }
}
