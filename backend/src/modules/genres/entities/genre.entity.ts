import { Entity, Column } from 'typeorm';
import { IntegerIdBaseEntity } from '@/common/entities/integer-base.entity';

@Entity('genres')
export class Genre extends IntegerIdBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;
}
