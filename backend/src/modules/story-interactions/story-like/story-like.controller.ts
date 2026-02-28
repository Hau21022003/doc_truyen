import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoryLikeService } from './story-like.service';
import { CreateStoryLikeDto } from './dto/create-story-like.dto';
import { UpdateStoryLikeDto } from './dto/update-story-like.dto';

@Controller('story-like')
export class StoryLikeController {
  constructor(private readonly storyLikeService: StoryLikeService) {}

  @Post()
  create(@Body() createStoryLikeDto: CreateStoryLikeDto) {
    return this.storyLikeService.create(createStoryLikeDto);
  }

  @Get()
  findAll() {
    return this.storyLikeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storyLikeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoryLikeDto: UpdateStoryLikeDto) {
    return this.storyLikeService.update(+id, updateStoryLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyLikeService.remove(+id);
  }
}
