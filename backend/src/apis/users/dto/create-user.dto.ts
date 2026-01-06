import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        example: 'admin',
        description: 'Tên đăng nhập',
    })
    username: string
}
