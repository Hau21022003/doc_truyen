import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { DateRangeDto } from '../base/date-range.dto';
import { FilterDto } from '../base/filter.dto';
import { PaginationDto } from '../base/pagination.dto';
import { SortingDto } from '../base/sorting.dto';

export class QueryBaseDto
  extends PaginationDto
  implements FilterDto, SortingDto, DateRangeDto
{
  // FilterDto properties
  @ApiPropertyOptional({
    description: 'Search term',
    example: 'keyword',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // SortingDto properties
  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  // DateRangeDto properties
  @ApiPropertyOptional({
    description: 'Start date for filtering',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering',
    example: '2023-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  // Helper methods
  get hasSorting(): boolean {
    return !!this.sortBy;
  }

  get hasFilter(): boolean {
    return !!this.search;
  }

  get hasDateRange(): boolean {
    return !!(this.startDate && this.endDate);
  }
}
