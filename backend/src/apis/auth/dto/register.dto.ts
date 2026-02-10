import { SUPPORTED_TIMEZONES } from '@/common/constants/timezone.constant';
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
    description: 'Tên hiển thị của người dùng',
    example: 'joe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mật khẩu đăng nhập',
    example: 'Abcd123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Asia/Ho_Chi_Minh',
    description: 'IANA timezone',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_TIMEZONES)
  timezone?: string;
}
