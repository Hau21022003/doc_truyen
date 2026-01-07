import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @ApiProperty({
    description: 'Search term',
    example: 'keyword',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}