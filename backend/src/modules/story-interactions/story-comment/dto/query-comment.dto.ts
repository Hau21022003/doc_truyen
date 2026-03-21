import { QueryBaseDto } from '@/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryCommentDto extends QueryBaseDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isFlagged?: boolean;
}
