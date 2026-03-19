import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class ViewStatsQueryDto {
  @ApiProperty({
    example: '2026-03-01',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsDateString()
  from: string; // YYYY-MM-DD

  @ApiProperty({
    example: '2026-03-10',
    description: 'End date (YYYY-MM-DD)',
  })
  @IsDateString()
  to: string; // YYYY-MM-DD
}
