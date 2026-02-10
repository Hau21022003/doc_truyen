import { SUPPORTED_TIMEZONES } from '@/common/constants/timezone.constant';
import { IsStrongPassword, IsUnique, StringTrim } from '@/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthProvider, User, UserRole } from '../entities/user.entity';

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
    example: 'Abcd123!',
    description: 'Mật khẩu',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'Tên',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @StringTrim()
  name: string;

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
    enum: UserRole,
    example: UserRole.READER,
    description: 'Vai trò của người dùng',
    default: UserRole.READER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    example: 'Asia/Ho_Chi_Minh',
    description: 'IANA timezone',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_TIMEZONES)
  timezone?: string;

  @IsEnum(AuthProvider)
  @IsOptional()
  provider?: AuthProvider = AuthProvider.LOCAL;

  @IsOptional()
  googleId?: string;

  @IsOptional()
  facebookId?: string;
}
