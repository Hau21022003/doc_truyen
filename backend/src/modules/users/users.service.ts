import { comparePassword, hashPassword } from '@/common/utils/crypto.util';
import { AppConfigService } from '@/config/app-config.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MediaService } from '../media/media.service';
import { CreateUserDto, QueryUserDto, UpdateProfileDto, UpdateUserDto, UserListResponseDto } from './dto';
import { RefreshTokenInfo, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: AppConfigService,
    private readonly mediaService: MediaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async findAll(query: QueryUserDto): Promise<UserListResponseDto> {
    const { page = 1, limit = 10, search, isActive, role } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (role) {
      where.role = role;
    }

    if (search) {
      where.email = Like(`%${search}%`);
    }

    const [data, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // return this.createUserResponseDto(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Handle password hashing if provided
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    // Prepare update data without password if it's not being updated
    const updateData: Partial<User> = { ...updateUserDto };
    if (!updateUserDto.password) {
      delete updateData.password;
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    avatarFile?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Chuẩn bị data update
    const updateData: any = { ...updateProfileDto };

    // Xử lý avatar nếu có
    if (avatarFile) {
      // Xóa ảnh cũ nếu có
      if (user.avatarPublicId) {
        await this.mediaService.deleteImage(user.avatarPublicId);
      }

      const uploadResult = await this.mediaService.uploadImage(avatarFile, {
        folder: 'avatars',
        publicId: `user_${userId}`, // ID cố định cho mỗi user
      });

      updateData.avatar = uploadResult.url;
      updateData.avatarPublicId = uploadResult.publicId;
    }

    // Update database
    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const removedUser = { ...user };
    await this.userRepository.remove(user);
    return removedUser;
  }

  async updateLastLogin(id: string): Promise<User> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken: refreshToken,
    });
  }

  /**
   * Kiểm tra xem refresh token có còn hợp lệ không
   */
  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, refreshTokens: true },
    });

    if (!user || !user.refreshTokens) {
      return false;
    }

    // Check token exists
    for (const rt of user.refreshTokens) {
      const expiresAt = new Date(rt.expiresAt);

      const isMatch = await comparePassword(refreshToken, rt.tokenHash);

      if (isMatch && expiresAt.getTime() > Date.now()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Thêm một refresh token mới
   */
  async addRefreshToken(userId: string, refreshToken: string, deviceInfo?: { deviceName?: string }): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, refreshTokens: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const expiresAt = new Date(Date.now() + this.configService.jwtRefreshExpiresInMs);
    const tokenHash = await hashPassword(refreshToken);

    const newToken: RefreshTokenInfo = {
      tokenHash: tokenHash,
      deviceName: deviceInfo?.deviceName || 'Unknown Device',
      createdAt: new Date(),
      expiresAt,
    };

    // Thêm token mới vào mảng
    const updatedTokens = user.refreshTokens ? [...user.refreshTokens, newToken] : [newToken];

    // Xóa các token đã hết hạn
    const validTokens = updatedTokens.filter((token) => new Date(token.expiresAt).getTime() > Date.now());

    await this.userRepository.update(userId, {
      refreshTokens: validTokens,
    });
  }

  /**
   * Thu hồi một refresh token cụ thể
   */
  async revokeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, refreshTokens: true },
    });

    if (!user || !user.refreshTokens) {
      return;
    }

    // const updatedTokens = user.refreshTokens.filter((token) => token.tokenHash !== refreshToken);

    const updatedTokens: RefreshTokenInfo[] = [];

    for (const rt of user.refreshTokens) {
      const isMatch = await comparePassword(refreshToken, rt.tokenHash);

      if (!isMatch) {
        updatedTokens.push(rt);
      }
    }

    await this.userRepository.update(userId, { refreshTokens: updatedTokens });
  }

  /**
   * Thu hồi tất cả refresh token của user (logout tất cả thiết bị)
   */
  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshTokens: [] });
  }

  /**
   * Lấy danh sách các thiết bị đã đăng nhập
   */
  async getActiveDevices(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, refreshTokens: true },
    });

    if (!user || !user.refreshTokens) {
      return [];
    }

    return user.refreshTokens
      .filter((token) => new Date(token.expiresAt).getTime() > Date.now())
      .map(({ tokenHash, ...deviceInfo }) => deviceInfo);
  }

  findByFacebookId(facebookId: string) {
    return this.userRepository.findOneBy({ facebookId });
  }

  findByGoogleId(googleId: string) {
    return this.userRepository.findOneBy({ googleId });
  }
}
