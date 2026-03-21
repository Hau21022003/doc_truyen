import { IntegerIdBaseEntity } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StoryCommentReport } from './story-comment-report.entity';

@Entity('story_comment')
@Index(['storyId'])
@Index(['userId'])
@Index(['chapterId'])
export class StoryComment extends IntegerIdBaseEntity {
  @Column()
  storyId: number;

  @Column({ nullable: true })
  userId: string | null;

  @Column({ type: 'text', nullable: true })
  guestName: string | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'number', nullable: true })
  chapterId: number | null;

  // đánh dấu comment bị báo cáo
  @Column({ default: false })
  isFlagged: boolean;

  @Column({ default: 0 })
  flagCount: number;

  @ManyToOne(() => Story, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storyId' })
  story: Story;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ManyToOne(() => Chapter, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'chapterId' })
  chapter: Chapter | null;

  @OneToMany(() => StoryCommentReport, (report) => report.comment)
  reports: StoryCommentReport[];
}
