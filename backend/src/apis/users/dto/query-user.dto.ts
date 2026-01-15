import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsBoolean, IsEnum, Max } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class QueryUserDto {
  @ApiProperty({
    description: 'Trang số',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiProperty({
    description: 'Số lượng mục mỗi trang',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Tìm kiếm theo tên đăng nhập hoặc email',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    enum: UserRole,
    description: 'Vai trò người dùng',
    example: UserRole.READER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}