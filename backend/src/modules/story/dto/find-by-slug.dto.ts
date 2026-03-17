import { SortDirections } from '@/common';
import { IsEnum, IsOptional } from 'class-validator';

export class FindBySlugDto {
  @IsOptional()
  @IsEnum(SortDirections)
  chapterSort: SortDirections = SortDirections.DESC;
}
