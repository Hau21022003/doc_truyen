import { IsExist } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'ID of the story to bookmark',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsExist(Story, 'id')
  storyId: number;

  @ApiPropertyOptional({
    description: 'ID of the last read chapter',
    example: 5,
    nullable: true,
  })
  @IsOptional()
  @IsExist(Chapter, 'id')
  @IsNumber()
  lastReadChapterId?: number;
}
