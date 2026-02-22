import { IntegerIdBaseEntity } from '@/common/entities/integer-base.entity';
import { Column, Entity } from 'typeorm';

@Entity('tag')
export class Tag extends IntegerIdBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 0 })
  storyCount: number;
}
