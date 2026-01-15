import { Entity, Column } from 'typeorm';
import { UuidBaseEntity } from '@/common/entities/uuid-base.entity';

@Entity('users')
export class User extends UuidBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
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

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;
}
