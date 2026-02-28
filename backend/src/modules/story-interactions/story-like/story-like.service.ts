import { Injectable } from '@nestjs/common';
import { CreateStoryLikeDto } from './dto/create-story-like.dto';
import { UpdateStoryLikeDto } from './dto/update-story-like.dto';

@Injectable()
export class StoryLikeService {
  create(createStoryLikeDto: CreateStoryLikeDto) {
    return 'This action adds a new storyLike';
  }

  findAll() {
    return `This action returns all storyLike`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storyLike`;
  }

  update(id: number, updateStoryLikeDto: UpdateStoryLikeDto) {
    return `This action updates a #${id} storyLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} storyLike`;
  }
}
