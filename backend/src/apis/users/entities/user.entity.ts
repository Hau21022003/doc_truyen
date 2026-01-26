import { Entity, Column } from 'typeorm';
import { UuidBaseEntity } from '@/common/entities/uuid-base.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  READER = 'reader',
  CONTENT_ADMIN = 'content_admin',
  SYSTEM_ADMIN = 'system_admin',
}

@Entity('users')
export class User extends UuidBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.READER,
  })
  role: UserRole;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;
}
