import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({ status: 201, description: 'The genre has been successfully created.', type: Genre })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createGenreDto: CreateGenreDto) {
    return await this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, description: 'List of all genres.', type: [Genre] })
  async findAll() {
    return await this.genresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the genre', type: 'number' })
  @ApiResponse({ status: 200, description: 'The found genre.', type: Genre })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async findOne(@Param('id') id: string) {
    return await this.genresService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a genre by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the genre', type: 'number' })
  @ApiResponse({ status: 200, description: 'The genre has been successfully updated.', type: Genre })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return await this.genresService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a genre by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the genre', type: 'number' })
  @ApiResponse({ status: 204, description: 'The genre has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async remove(@Param('id') id: string) {
    return await this.genresService.remove(+id);
  }
}
