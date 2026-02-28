import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryCommentDto } from './create-story-comment.dto';

export class UpdateStoryCommentDto extends PartialType(CreateStoryCommentDto) {}
