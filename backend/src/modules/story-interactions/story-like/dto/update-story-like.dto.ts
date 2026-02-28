import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryLikeDto } from './create-story-like.dto';

export class UpdateStoryLikeDto extends PartialType(CreateStoryLikeDto) {}
