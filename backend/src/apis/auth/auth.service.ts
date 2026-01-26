import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AppConfigService } from '@/config/app-config.service';
import { AuthDto } from './dto/auth.dto';
import { comparePassword } from '@/common';
import { StringValue } from 'ms';
import { JwtPayload } from './types/jwt-payload';
import { UserResponseDto } from '../users/dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: AppConfigService,
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);
    if (!user) throw new UnauthorizedException();
    const passwordMatches = await comparePassword(authDto.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException();
    if (!user.isActive) {
      throw new BadRequestException('Your account is locked. Please contact support for assistance.');
    }

    const tokens = await this.getTokens(user);

    await Promise.all([
      this.usersService.updateRefreshToken(user.id, tokens.refreshToken),
      this.usersService.updateLastLogin(user.id),
    ]);

    return {
      account: user,
      ...tokens,
    };
  }

  async getTokens(user: UserResponseDto) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
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

  async googleLogin(req: any) {
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
      this.usersService.updateRefreshToken(user.id, tokens.refreshToken),
      this.usersService.updateLastLogin(user.id),
    ]);

    return {
      account: user,
      ...tokens,
    };
  }

  private generateRandomPassword(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}
