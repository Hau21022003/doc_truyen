import { StringTrim } from '@/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ContentType } from '../entities/chapter-content';

export class CreateChapterContentDto {
  @ApiProperty({
    description: 'Loại nội dung của chapter',
    enum: ContentType,
    example: ContentType.TEXT,
  })
  @IsEnum(ContentType)
  contentType: ContentType;

  @ApiPropertyOptional({
    description:
      'Nội dung văn bản của chapter (bắt buộc khi contentType là TEXT)',
    example:
      'Đây là nội dung chương đầu tiên, kể về cuộc hành trình của nhân vật chính...',
    minLength: 1,
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @StringTrim()
  @MinLength(1)
  @MaxLength(5000)
  textContent?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/chapter-cover.jpg',
    type: 'string',
    format: 'uri',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description:
      'Temp ID của ảnh đã upload (dùng để chuyển trạng thái từ draft sang published)',
    example: 'temp_chapter_12345',
  })
  @IsOptional()
  @IsString()
  imageTempId?: string;
}
