import { IntegerIdBaseEntity } from '@/common/entities/integer-base-entity';
import { Story } from '@/modules/story/entities/story.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('tag')
export class Tag extends IntegerIdBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => Story, (story) => story.tags)
  stories: Story[];

  storyCount?: number;
}
