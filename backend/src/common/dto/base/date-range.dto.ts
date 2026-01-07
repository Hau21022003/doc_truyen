import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date for filtering',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}