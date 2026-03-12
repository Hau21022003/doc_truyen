import { QUERY_SEPARATORS, QueryBaseDto } from '@/common';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class HomeStoryQueryDto extends QueryBaseDto {
  @Transform(({ value }) =>
    value
      ? value.split(QUERY_SEPARATORS.LIST) // ✅ Keep as strings (slugs)
      : [],
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // ✅ String array
  tags?: string[]; // ✅ String type for slugs
}
