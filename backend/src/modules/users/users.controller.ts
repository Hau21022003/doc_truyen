import { createMulterOptions, FILE_SIZES_MB } from '@/common';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type JwtPayload } from '../auth/types/jwt-payload';
import {
  CreateUserDto,
  QueryUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  UserListResponseDto,
  UserResponseDto,
} from './dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiCookieAuth('access_token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'User đã được tạo thành công.', type: UserResponseDto })
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
  @ApiResponse({ status: 200, description: 'Danh sách user.', type: UserListResponseDto })
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Thông tin user.', type: UserResponseDto })
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

  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar', createMulterOptions(FILE_SIZES_MB.AVATAR)))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileDto })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.sub, updateProfileDto, avatarFile);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User đã được cập nhật.', type: UserResponseDto })
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
  @ApiResponse({ status: 200, description: 'User đã được xóa.', type: UserResponseDto })
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
