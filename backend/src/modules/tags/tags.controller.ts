import { PaginatedResponseDto, QueryBaseDto } from '@/common/dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-genre.dto';
import { UpdateTagDto } from './dto/update-genre.dto';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiResponse({ status: 201, type: Tag })
  async create(@Body() createGenreDto: CreateTagDto) {
    return await this.tagsService.create(createGenreDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: PaginatedResponseDto<Tag> })
  async findAll(@Query() query: QueryBaseDto) {
    return await this.tagsService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Tag })
  async findOne(@Param('id') id: string) {
    return await this.tagsService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Tag })
  async update(@Param('id') id: string, @Body() updateGenreDto: UpdateTagDto) {
    return await this.tagsService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.tagsService.remove(+id);
  }
}
