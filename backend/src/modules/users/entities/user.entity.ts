import { UuidBaseEntity } from '@/common/entities/uuid-base.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum UserRole {
  READER = 'reader',
  CONTENT_ADMIN = 'content_admin',
  SYSTEM_ADMIN = 'system_admin',
}

export interface RefreshTokenInfo {
  tokenHash: string;
  deviceName?: string;
  createdAt: Date;
  expiresAt: Date;
}

@Entity('users')
export class User extends UuidBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  @Exclude()
  avatarPublicId?: string; // dành cho xóa file trên cloudinary

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.READER,
  })
  role: UserRole;

  @Column({ default: 'Asia/Saigon', length: 64 })
  timezone: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  facebookId?: string;

  @Column({ nullable: true, type: 'timestamptz' })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ type: 'json', nullable: true })
  @Exclude()
  refreshTokens: RefreshTokenInfo[];

  @Column({ default: true, type: 'boolean' })
  enableStoryNotifications: boolean;
}
