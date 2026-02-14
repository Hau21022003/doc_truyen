import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({
    description: 'The name of the genre',
    example: 'Science Fiction',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The URL-friendly slug for the genre',
    example: 'science-fiction',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
