import { IntegerIdBaseEntity } from '@/common';
import { StoryRating } from '@/modules/story-interactions/story-rating/entities/story-rating.entity';
import { Tag } from '@/modules/tags/entities/tag.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Chapter } from '../../chapter/entities/chapter.entity';

export enum StoryStatus {
  DRAFT = 'draft', // Bản nháp - đang biên tập
  PUBLISHED = 'published', // Đang xuất bản - công khai
  ARCHIVED = 'archived', // Lưu trữ - không hiển thị ra ở storiespage
}

export enum StoryProgress {
  ONGOING = 'ongoing', // Đang tiến hành - chuỗi chương chưa kết thúc
  COMPLETED = 'completed', // Đã hoàn thành - truyện đã kết thúc
  HIATUS = 'hiatus', // Tạm ngưng - tác giả tạm dừng đăng
}

@Entity('story')
export class Story extends IntegerIdBaseEntity {
  @Column()
  title: string;

  @Index()
  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true, type: 'varchar' })
  coverImage: string | null;

  @Column({ nullable: true })
  authorName: string;

  @Column({
    type: 'enum',
    enum: StoryStatus,
    default: StoryStatus.DRAFT,
  })
  status: StoryStatus;

  @Column({
    type: 'enum',
    enum: StoryProgress,
    default: StoryProgress.ONGOING,
  })
  progress: StoryProgress;

  // To know when last chapter added
  @Column({ nullable: true, type: 'timestamptz' })
  lastAddedChapterDate?: Date;

  @Column({ default: 0 })
  viewCount: number;

  // ⭐ rating cache
  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @ManyToMany(() => Tag, (tag) => tag.stories, { cascade: false })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Chapter, (chapter) => chapter.story)
  chapters: Chapter[];

  @OneToMany(() => StoryRating, (rating) => rating.story)
  ratings: StoryRating[];
}
