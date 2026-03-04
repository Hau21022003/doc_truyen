import { QUERY_SEPARATORS } from '@/common';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class DeleteManyTagsDto {
  @Transform(({ value }) =>
    value.split(QUERY_SEPARATORS.LIST).map((v: string) => Number(v)),
  )
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  ids: number[];
}
