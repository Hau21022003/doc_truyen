import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  // ========== JWT ==========
  get jwtSecret(): string {
    return this.config.getOrThrow('jwt.secret');
  }

  get jwtExpiresIn(): string {
    return this.config.get('jwt.expiresIn', '1d');
  }

  // ========== DATABASE ==========
  get dbHost(): string {
    return this.config.getOrThrow('database.host');
  }

  get dbPort(): number {
    return this.config.getOrThrow('database.port');
  }

  get dbUser(): string {
    return this.config.getOrThrow('database.username');
  }

  get dbPassword(): string {
    return this.config.getOrThrow('database.password');
  }
}
