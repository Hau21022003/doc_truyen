import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { QueryBaseDto } from './query-base.dto';

export class WithDeletedQueryDto extends QueryBaseDto {
  @ApiPropertyOptional({
    description: 'Include soft deleted records',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean = false;
}