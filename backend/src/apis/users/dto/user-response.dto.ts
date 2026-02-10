import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID của user',
  })
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email của user',
  })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'Tên',
    required: false,
  })
  name: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL ảnh đại diện',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    example: true,
    description: 'Trạng thái hoạt động',
  })
  isActive: boolean;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.READER,
    description: 'Vai trò của người dùng',
  })
  role: UserRole;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Thời gian đăng nhập lần cuối',
    required: false,
  })
  lastLoginAt?: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Thời gian tạo',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Thời gian cập nhật',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 'Asia/Ho_Chi_Minh',
    description: 'timezone',
  })
  timezone: string;
}

export class UserListResponseDto {
  @ApiProperty({
    description: 'Danh sách user',
    type: [UserResponseDto],
  })
  data: UserResponseDto[];

  @ApiProperty({
    description: 'Số trang hiện tại',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Số lượng mục mỗi trang',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Tổng số mục',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Tổng số trang',
    example: 10,
  })
  totalPages: number;
}
