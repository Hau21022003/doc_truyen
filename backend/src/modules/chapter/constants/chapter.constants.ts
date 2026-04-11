import { ExcelColumnDef } from '@/modules/common/excel/excel-column-def.interface';
import { ContentType } from '../entities/chapter-content';
import { ChapterStatus } from '../entities/chapter.entity';

export const CHAPTER_SORTABLE_COLUMNS = [
  'chapterNumber',
  'publishedAt',
  'createdAt',
  'updatedAt',
];

export const CHAPTER_SEARCHABLE_COLUMNS = ['title', 'slug'];

export interface ChapterExcelRow {
  chapterNumber: number;
  title: string;
  slug: string;
  status: ChapterStatus;
  contentType: ContentType;
  textContent?: string;
  imageUrl?: string;
}

export const CHAPTER_EXCEL_COLUMNS: ExcelColumnDef<ChapterExcelRow>[] = [
  {
    header: 'Chapter Number',
    key: 'chapterNumber',
    width: 16,
    required: true,
    parse: (v) => {
      const num = Number(v);
      return isNaN(num) ? null : num;
    },
  },
  {
    header: 'Title',
    key: 'title',
    width: 35,
    required: true,
  },
  {
    header: 'Slug',
    key: 'slug',
    width: 35,
  },
  {
    header: 'Status',
    key: 'status',
    width: 14,
    transform: (v: ChapterStatus) => v ?? ChapterStatus.DRAFT,
    parse: (v) => {
      const val = String(v ?? '').toLowerCase();
      if (Object.values(ChapterStatus).includes(val as ChapterStatus)) {
        return val as ChapterStatus;
      }
      return ChapterStatus.DRAFT;
    },
  },
  {
    header: 'Content Type',
    key: 'contentType',
    width: 14,
    required: true,
    transform: (v: ContentType) => v ?? ContentType.TEXT,
    parse: (v) => {
      const val = String(v ?? '').toLowerCase();
      return val === ContentType.IMAGE ? ContentType.IMAGE : ContentType.TEXT;
    },
  },
  {
    header: 'Text Content',
    key: 'textContent',
    width: 60,
    parse: (v) => (v != null && v !== '' ? String(v) : undefined),
  },
  {
    header: 'Image URL',
    key: 'imageUrl',
    width: 50,
    parse: (v) => (v != null && v !== '' ? String(v) : undefined),
  },
];
