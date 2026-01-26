import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto, UserResponseDto, UserListResponseDto } from './dto';
import { ApiOperation, ApiTags, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiCookieAuth('access_token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo user mới' })
  @ApiResponse({ status: 201, description: 'User đã được tạo thành công.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  @ApiResponse({ status: 409, description: 'Email hoặc username đã tồn tại.' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new ConflictException('Email hoặc username đã tồn tại');
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách user' })
  @ApiResponse({ status: 200, description: 'Danh sách user.', type: UserListResponseDto })
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin user theo ID' })
  @ApiResponse({ status: 200, description: 'Thông tin user.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy user.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin user' })
  @ApiResponse({ status: 200, description: 'User đã được cập nhật.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy user.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new ConflictException('Email hoặc username đã tồn tại');
      }
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa user' })
  @ApiResponse({ status: 200, description: 'User đã được xóa.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy user.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }
  }
}
