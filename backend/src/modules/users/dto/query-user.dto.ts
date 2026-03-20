import { QueryBaseDto } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class QueryUserDto extends QueryBaseDto {
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
