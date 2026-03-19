import { IntegerIdBaseEntity } from '@/common';
import { Column, Entity, Index } from 'typeorm';

@Entity('story_view_daily')
@Index(['storyId', 'viewDate'], { unique: true })
export class StoryViewDaily extends IntegerIdBaseEntity {
  @Column()
  storyId: number;

  // YYYY-MM-DD
  @Column({ type: 'date' })
  viewDate: string;

  @Column({ default: 0 })
  totalViews: number;
}
