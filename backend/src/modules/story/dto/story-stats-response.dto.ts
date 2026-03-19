import { ApiProperty } from '@nestjs/swagger';

export class StoryStatsResponseDto {
  @ApiProperty({
    description: 'Tổng số truyện',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Số truyện đang tiến hành',
    example: 95,
  })
  ongoing: number;

  @ApiProperty({
    description: 'Số truyện đã hoàn thành',
    example: 45,
  })
  completed: number;

  @ApiProperty({
    description: 'Số truyện tạm ngưng',
    example: 10,
  })
  hiatus: number;
}
