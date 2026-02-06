import { Timezone, TIMEZONE_VALUES, type TimezoneValue } from '@/common/constants/timezone.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email đăng nhập của người dùng',
    example: 'admin@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu đăng nhập',
    example: 'Abcd123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    enum: Timezone,
    example: Timezone.ASIA_HO_CHI_MINH,
    description: 'Timezone',
    default: Timezone.ASIA_HO_CHI_MINH,
  })
  @IsOptional()
  @IsIn(TIMEZONE_VALUES)
  timezone?: TimezoneValue;
}
