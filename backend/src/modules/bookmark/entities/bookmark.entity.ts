import { IntegerIdBaseEntity } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('bookmark')
@Index(['userId', 'storyId'], { unique: true })
export class Bookmark extends IntegerIdBaseEntity {
  @Column()
  userId: string;

  @Column()
  storyId: number;

  @Column({ nullable: true })
  lastReadChapterId: number | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storyId' })
  story: Story;

  @ManyToOne(() => Chapter, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastReadChapterId' })
  lastReadChapter: Chapter | null;
}
