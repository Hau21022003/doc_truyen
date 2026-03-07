import { IntegerIdBaseEntity } from '@/common';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Story } from '../../story/entities/story.entity';
import { ChapterContent } from './chapter-content';

export enum ChapterStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('chapter')
export class Chapter extends IntegerIdBaseEntity {
  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ type: 'int', nullable: true })
  chapterNumber: number; // Số thứ tự chương

  @Column({
    type: 'enum',
    enum: ChapterStatus,
    default: ChapterStatus.DRAFT,
  })
  status: ChapterStatus;

  @Column({ nullable: true })
  publishedAt?: Date; // Ngày xuất bản chương

  @ManyToOne(() => Story, (story) => story.chapters, { onDelete: 'CASCADE' })
  story: Story;

  @OneToMany(() => ChapterContent, (content) => content.chapter, {
    cascade: true,
  })
  contents: ChapterContent[];
}
