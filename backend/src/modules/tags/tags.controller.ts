import { QueryBaseDto } from '@/common/dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CreateTagDto } from './dto/create-genre.dto';
import { DeleteManyTagsDto } from './dto/delete-many-tags.dto';
import { UpdateTagDto } from './dto/update-genre.dto';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiResponse({ status: 201, type: Tag })
  async create(@Body() createGenreDto: CreateTagDto) {
    return await this.tagsService.create(createGenreDto);
  }

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN)
  async query(@Query() query: QueryBaseDto) {
    return await this.tagsService.query(query);
  }

  @Get(`all`)
  @Public()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Tag })
  async findOne(@Param('id') id: string) {
    return await this.tagsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiResponse({ status: 200, type: Tag })
  async update(@Param('id') id: string, @Body() updateGenreDto: UpdateTagDto) {
    return await this.tagsService.update(+id, updateGenreDto);
  }

  @Patch(':id/featured')
  @Roles(UserRole.SYSTEM_ADMIN)
  setFeatured(
    @Param('id', ParseIntPipe) id: number,
    @Body('isFeatured') isFeatured: boolean,
  ) {
    return this.tagsService.setFeatured(Number(id), isFeatured);
  }

  @Delete('bulk')
  @Roles(UserRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMany(@Query() query: DeleteManyTagsDto) {
    return this.tagsService.removeMany(query.ids);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.tagsService.remove(+id);
  }
}
