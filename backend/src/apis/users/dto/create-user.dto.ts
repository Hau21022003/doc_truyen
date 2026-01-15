import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { IsStrongPassword, IsUnique, StringTrim } from '@/common/decorators';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  @IsUnique(User, 'email')
  @StringTrim()
  email: string;

  @ApiProperty({
    example: 'John123!@#',
    description: 'Mật khẩu',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Tên đăng nhập',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsUnique(User, 'username')
  @StringTrim()
  username: string;

  @ApiProperty({
    example: 'John',
    description: 'Tên',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @StringTrim()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Họ',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @StringTrim()
  lastName?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL ảnh đại diện',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;

  @ApiProperty({
    example: true,
    description: 'Trạng thái hoạt động',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: false,
    description: 'Là quản trị viên',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
