import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserDto, UpdateUserDto, QueryUserDto, UserListResponseDto, UserResponseDto } from './dto';
import { User } from './entities/user.entity';
import { hashPassword } from '@/common/utils/crypto.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      where.username = Like(`%${search}%`);
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

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
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
}
