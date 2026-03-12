import { IsExist } from '@/common';
import { Story } from '@/modules/story/entities/story.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class RateStoryDto {
  @ApiProperty({
    description: 'ID của story muốn đánh giá',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @IsExist(Story, 'id')
  storyId: number;

  @ApiProperty({
    description: 'Đánh giá từ 1 đến 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
