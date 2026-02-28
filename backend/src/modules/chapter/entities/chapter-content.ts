import { IntegerIdBaseEntity } from '@/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Chapter } from './chapter.entity';

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
}

@Entity('chapter_content')
export class ChapterContent extends IntegerIdBaseEntity {
  @Column()
  position: number; // Vị trí sắp xếp (0, 1, 2,...)

  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.TEXT,
  })
  contentType: ContentType;

  @Column('text', { nullable: true })
  textContent?: string; // Nội dung text

  @Column('text', { nullable: true })
  imageUrl?: string; // URL ảnh

  @Column({ nullable: false })
  chapterId: number;

  @ManyToOne(() => Chapter, (chapter) => chapter.contents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chapterId' })
  chapter: Chapter;
}
