import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AppConfigService } from '@/config/app-config.service';
import { LoginDto } from './dto';
import { comparePassword } from '@/common';
import { StringValue } from 'ms';
import { JwtPayload } from './types/jwt-payload';
import { UserResponseDto } from '../users/dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: AppConfigService,
  ) {}

  async getTokens(user: UserResponseDto) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      timezone: user.timezone,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.jwtAccessSecret,
        expiresIn: this.configService.jwtAccessExpiresIn as StringValue,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.jwtRefreshSecret,
        expiresIn: this.configService.jwtRefreshExpiresIn as StringValue,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async login(authDto: LoginDto, deviceInfo?: { deviceName?: string }) {
    const user = await this.usersService.findByEmail(authDto.email);
    if (!user) throw new UnauthorizedException();
    const passwordMatches = await comparePassword(authDto.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException();
    if (!user.isActive) {
      throw new BadRequestException('Your account is locked. Please contact support for assistance.');
    }

    const tokens = await this.getTokens(user);

    await Promise.all([
      // this.usersService.updateRefreshToken(user.id, tokens.refreshToken),
      this.usersService.addRefreshToken(user.id, tokens.refreshToken, deviceInfo),
      this.usersService.updateLastLogin(user.id),
    ]);

    return {
      account: user,
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    let user = await this.usersService.findByEmail(registerDto.email);
    if (user) {
      throw new BadRequestException('Email exists');
    }
    const created = await this.usersService.create(registerDto);
    const tokens = await this.getTokens(created);

    await Promise.all([
      this.usersService.addRefreshToken(created.id, tokens.refreshToken),
      this.usersService.updateLastLogin(created.id),
    ]);

    return {
      account: created,
      ...tokens,
    };
  }

  async googleLogin(req: any, deviceInfo?: { deviceName?: string }) {
    if (!req.user) {
      throw new UnauthorizedException('Google authentication failed');
    }

    const { email, firstName, lastName, picture } = req.user;

    // Check if user already exists
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Create new user if not exists
      const createUserDto = {
        email,
        username: email.split('@')[0],
        firstName,
        lastName,
        avatar: picture,
        password: this.generateRandomPassword(),
      };

      user = await this.usersService.create(createUserDto);
    } else {
      if (!user.isActive) {
        throw new BadRequestException('Your account is locked. Please contact support for assistance.');
      }
    }

    // Generate tokens
    const tokens = await this.getTokens(user);

    await Promise.all([
      this.usersService.addRefreshToken(user.id, tokens.refreshToken, deviceInfo),
      this.usersService.updateLastLogin(user.id),
    ]);

    return {
      account: user,
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    // Kiểm tra refresh token có hợp lệ không
    const isValid = await this.usersService.validateRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Tìm user
    const user = await this.usersService.findOne(userId);
    const tokens = await this.getTokens(user);

    // Thu hồi token cũ và thêm token mới
    await this.usersService.revokeRefreshToken(userId, refreshToken);
    await this.usersService.addRefreshToken(userId, tokens.refreshToken);

    return {
      account: user,
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Thu hồi chỉ refresh token cụ thể (logout một thiết bị)
      await this.usersService.revokeRefreshToken(userId, refreshToken);
    } else {
      // Thu hồi tất cả refresh token (logout tất cả thiết bị)
      await this.usersService.revokeAllRefreshTokens(userId);
    }

    return { message: 'Logged out successfully' };
  }

  private generateRandomPassword(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}
