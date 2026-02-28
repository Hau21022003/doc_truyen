import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoryCommentService } from './story-comment.service';
import { CreateStoryCommentDto } from './dto/create-story-comment.dto';
import { UpdateStoryCommentDto } from './dto/update-story-comment.dto';

@Controller('story-comment')
export class StoryCommentController {
  constructor(private readonly storyCommentService: StoryCommentService) {}

  @Post()
  create(@Body() createStoryCommentDto: CreateStoryCommentDto) {
    return this.storyCommentService.create(createStoryCommentDto);
  }

  @Get()
  findAll() {
    return this.storyCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storyCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoryCommentDto: UpdateStoryCommentDto) {
    return this.storyCommentService.update(+id, updateStoryCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyCommentService.remove(+id);
  }
}
