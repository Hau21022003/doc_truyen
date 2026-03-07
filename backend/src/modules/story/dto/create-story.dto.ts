import { StringTrim } from '@/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StoryProgress, StoryStatus } from '../entities/story.entity';

export class CreateStoryDto {
  @ApiProperty({
    description: 'The title of the story',
    example: 'The Adventure of a Lifetime',
    type: String,
  })
  @IsString()
  @StringTrim()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'The URL-friendly slug for the genre',
    example: 'science-fiction',
    type: String,
  })
  @IsString()
  @StringTrim()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    description: 'The description of the story',
    example:
      'A thrilling adventure through mysterious lands full of danger and excitement.',
    type: String,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Cover image tempId for the story',
    example: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    type: String,
  })
  @IsOptional()
  @IsString()
  coverImageTempId?: string;

  @ApiProperty({
    description: 'Author name for the story',
    example: 'John Doe',
    type: String,
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  authorName: string;

  @ApiPropertyOptional({
    description: 'The status of the story',
    enum: StoryStatus,
    example: StoryStatus.DRAFT,
    default: StoryStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(StoryStatus)
  @IsIn(Object.values(StoryStatus))
  status?: StoryStatus = StoryStatus.DRAFT;

  @ApiPropertyOptional({
    description: 'The progress status of the story',
    enum: StoryProgress,
    example: StoryProgress.ONGOING,
    default: StoryProgress.ONGOING,
  })
  @IsOptional()
  @IsEnum(StoryProgress)
  @IsIn(Object.values(StoryProgress))
  progress?: StoryProgress = StoryProgress.ONGOING;

  @ApiPropertyOptional({
    description: 'Array of tag IDs to associate with the story',
    example: [1, 5, 12],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds: number[] = [];
}
