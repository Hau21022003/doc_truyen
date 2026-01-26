import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  // ========== JWT ACCESS ==========
  get jwtAccessSecret(): string {
    return this.config.getOrThrow<string>('jwt.access.secret');
  }

  get jwtAccessExpiresIn(): string {
    return this.config.get<string>('jwt.access.expiresIn', '15m');
  }

  get jwtAccessExpiresInMs(): number {
    return ms(this.jwtAccessExpiresIn as StringValue);
  }

  // ========== JWT REFRESH ==========
  get jwtRefreshSecret(): string {
    return this.config.getOrThrow<string>('jwt.refresh.secret');
  }

  get jwtRefreshExpiresIn(): string {
    return this.config.get<string>('jwt.refresh.expiresIn', '7d');
  }

  get jwtRefreshExpiresInMs(): number {
    return ms(this.jwtRefreshExpiresIn as StringValue);
  }

  // ========== DATABASE ==========
  get dbHost(): string {
    return this.config.getOrThrow('database.host');
  }

  get dbName(): string {
    return this.config.getOrThrow('database.name');
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

  get dbSynchronize(): boolean {
    return this.config.get('database.synchronize', false);
  }

  get dbLogging(): boolean {
    return this.config.get('database.logging', false);
  }

  // ========== GOOGLE OAUTH ==========
  get googleClientId(): string {
    return this.config.getOrThrow<string>('oauth.google.clientId');
  }

  get googleClientSecret(): string {
    return this.config.getOrThrow<string>('oauth.google.clientSecret');
  }

  get googleCallbackURL(): string {
    return this.config.getOrThrow<string>('oauth.google.callbackURL');
  }

  // ========== CLIENT APPLICATION ==========
  get clientUrl(): string {
    return this.config.getOrThrow<string>('CLIENT_URL');
  }
}
