import { StringTrim } from '@/common';
import { SUPPORTED_TIMEZONES } from '@/common/constants/timezone.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar?: any;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @StringTrim()
  name?: string;

  @ApiProperty({
    example: 'Asia/Saigon',
    description: 'IANA timezone',
    default: 'UTC',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_TIMEZONES)
  timezone?: string;

  @ApiProperty({
    example: true,
    description: 'Enable story notifications',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  enableStoryNotifications?: boolean;
}
