import { IsExist } from '@/common';
import { Story } from '@/modules/story/entities/story.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContentType } from '../entities/chapter-content';
import { CreateChapterContentDto } from './create-chapter-content.dto';

export class CreateChapterDto {
  @ApiProperty({
    description: 'Tiêu đề của chương',
    example: 'Chương 1: Bắt đầu hành trình',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Số thứ tự của chương',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  chapterNumber?: number;

  @ApiPropertyOptional({
    description: 'Danh sách nội dung của chương',
    type: [CreateChapterContentDto],
    isArray: true,
    example: [
      {
        contentType: ContentType.TEXT,
        textContent: 'Nội dung chương...',
      },
      {
        contentType: ContentType.IMAGE,
        imageUrl: 'https://example.com/image.jpg',
        imageTempId: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterContentDto)
  contents?: CreateChapterContentDto[];

  @ApiProperty({
    description: 'ID của truyện mà chương này thuộc về',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsExist(Story, 'id')
  storyId: number;
}
