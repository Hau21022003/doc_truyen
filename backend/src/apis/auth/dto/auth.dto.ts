import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'Email đăng nhập của người dùng',
    example: 'john.doe@example.com',
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
}
