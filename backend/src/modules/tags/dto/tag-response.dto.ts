import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({
    description: 'Tag ID',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Tag name',
    example: 'Science Fiction',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Tag slug',
    example: 'science-fiction',
    type: String,
  })
  slug: string;

  @ApiProperty({
    description: 'Number of stories associated with this tag',
    example: 25,
    type: Number,
  })
  storyCount: number;

  @ApiProperty({
    description: 'Tag creation date',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Tag update date',
    type: Date,
  })
  updatedAt: Date;
}
