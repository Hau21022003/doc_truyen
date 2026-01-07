import { Entity, Column } from 'typeorm';
import { UuidBaseEntity } from '@/common/entities/uuid-base.entity';

@Entity('users')
export class User extends UuidBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
