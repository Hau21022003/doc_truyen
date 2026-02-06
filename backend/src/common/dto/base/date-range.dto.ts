import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsString, Matches } from 'class-validator';

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

  @ApiProperty({
    description: 'Timezone for date conversion (IANA format)',
    example: 'Asia/Ho_Chi_Minh',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z_\/]+$/, { message: 'Invalid timezone format' })
  timezone?: string;
}
