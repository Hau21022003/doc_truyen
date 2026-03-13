import { IntegerIdBaseEntity } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('story_comment')
@Index(['storyId'])
@Index(['userId'])
@Index(['chapterId'])
// @Index(['parentCommentId'])
export class StoryComment extends IntegerIdBaseEntity {
  @Column()
  storyId: number;

  @Column({ nullable: true })
  userId: string | null;

  @Column({ type: 'text', nullable: true })
  guestName: string | null;

  @Column({ type: 'text' })
  content: string;

  // @Column({ nullable: true })
  // parentCommentId: number | null;

  // @Column({ type: 'text', nullable: true })
  // chapterId: string | null;

  @Column({ type: 'number', nullable: true })
  chapterId: number | null;

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

  // @ManyToOne(() => StoryComment, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'parentCommentId' })
  // parentComment: StoryComment | null;
}
