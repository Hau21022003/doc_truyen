import { IntegerIdBaseEntity } from '@/common';
import { User } from '@/modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { StoryComment } from './story-comment.entity';

export enum ReportReason {
  SPAM = 'spam',
  OFFENSIVE = 'offensive',
  INAPPROPRIATE = 'inappropriate',
  HARASSMENT = 'harassment',
  MISINFORMATION = 'misinformation',
  OTHER = 'other',
}

@Entity('story_comment_report')
@Index(['commentId'])
@Index(['reporterId'])
export class StoryCommentReport extends IntegerIdBaseEntity {
  @Column()
  commentId: number;

  @Column({ nullable: true })
  reporterId: string | null; // null nếu guest report

  @Column({ type: 'enum', enum: ReportReason })
  reason: string; // Lý do báo cáo: spam, offensive, inappropriate, etc.

  @Column({ type: 'text', nullable: true })
  description: string; // Mô tả chi tiết

  @ManyToOne(() => StoryComment, (comment) => comment.reports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: StoryComment;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reporterId' })
  reporter: User | null;
}
