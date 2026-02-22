import { StringTrim } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'The name of the genre',
    example: 'Science Fiction',
    type: String,
  })
  @IsString()
  @StringTrim()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The URL-friendly slug for the genre',
    example: 'science-fiction',
    type: String,
  })
  @IsString()
  @StringTrim()
  @IsNotEmpty()
  slug: string;
}
