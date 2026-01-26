import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({}), PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, GoogleStrategy],
})
export class AuthModule {}
