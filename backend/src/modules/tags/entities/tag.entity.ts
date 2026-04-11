import { IntegerIdBaseEntity } from '@/common/entities/integer-base-entity';
import { Story } from '@/modules/story/entities/story.entity';
import { Column, Entity, Index, ManyToMany } from 'typeorm';

@Entity('tag')
export class Tag extends IntegerIdBaseEntity {
  @Column({ unique: true })
  name: string;

  @Index()
  @Column({ unique: true })
  slug: string;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToMany(() => Story, (story) => story.tags)
  stories?: Story[];

  storyCount?: number;
}
