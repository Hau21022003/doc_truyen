import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({
    description: 'The title of the story',
    example: 'The Adventure of a Lifetime',
    type: String,
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Array of tag IDs to associate with the story',
    example: [1, 5, 12],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds: number[] = [];
}
