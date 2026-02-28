import { IsExist } from '@/common';
import { Story } from '@/modules/story/entities/story.entity';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateChapterContentDto } from './create-chapter-content.dto';

export class CreateChapterDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  chapterNumber?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterContentDto)
  contents?: CreateChapterContentDto[];

  @IsNotEmpty()
  @IsExist(Story, 'id')
  storyId: number;
}
