import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../base/pagination.dto';
import { FilterDto } from '../base/filter.dto';
import { SortingDto } from '../base/sorting.dto';
import { DateRangeDto } from '../base/date-range.dto';

export class QueryBaseDto extends PaginationDto implements FilterDto, SortingDto, DateRangeDto {
  // FilterDto properties
  @ApiPropertyOptional({
    description: 'Search term',
    example: 'keyword',
  })
  search?: string;

  // SortingDto properties
  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
  })
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  // DateRangeDto properties
  @ApiPropertyOptional({
    description: 'Start date for filtering',
    example: '2023-01-01',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering',
    example: '2023-12-31',
  })
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