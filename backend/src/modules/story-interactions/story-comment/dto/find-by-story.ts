import { IsExist, PaginationDto } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FindByStoryDto extends PaginationDto {
  @ApiProperty({
    description: 'ID của story muốn comment',
    example: 1,
  })
  @IsNotEmpty()
  @IsExist(Story, 'id')
  storyId: number;

  @ApiProperty({
    description:
      '(Optional) ID của chapter để ưu hiên comments của chapter lên đầu',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsExist(Chapter, 'id')
  chapterId?: number;
}
