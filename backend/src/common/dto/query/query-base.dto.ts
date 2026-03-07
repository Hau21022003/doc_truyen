import { SortDirections } from '@/common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
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
  })
  @IsOptional()
  @IsString()
  search?: string;

  // SortingDto properties
  @ApiPropertyOptional({
    description: 'Sort field createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    example: 'DESC',
    enum: SortDirections,
  })
  @IsOptional()
  @IsEnum(SortDirections)
  sortOrder?: SortDirections = SortDirections.ASC;

  // DateRangeDto properties
  @ApiPropertyOptional({
    description: 'Start date for filtering (example: 2023-01-01)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (example: 2023-01-01)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    example: 'Asia/Saigon',
    description: 'IANA timezone',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  timezone: string;

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
