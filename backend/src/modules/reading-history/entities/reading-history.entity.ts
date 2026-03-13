import { IntegerIdBaseEntity } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('reading_history')
export class ReadingHistory extends IntegerIdBaseEntity {
  @Column()
  userId: string;

  @Column()
  storyId: number;

  @Column()
  chapterId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storyId' })
  story: Story;

  @ManyToOne(() => Chapter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapterId' })
  chapter: Chapter;
}
