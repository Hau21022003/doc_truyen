import { ExcelColumnDef } from '@/common/excel/excel-column-def.interface';
import { Story, StoryProgress, StoryStatus } from '../entities/story.entity';

export const STORY_SORTABLE_COLUMNS = [
  'title',
  'createdAt',
  'updatedAt',
  'viewCount',
  'lastAddedChapterDate',
];

export const STORY_SEARCHABLE_COLUMNS = [
  'title',
  'slug',
  'authorName',
  'description',
];

export const HOT_STORY_CONFIG = {
  /**
   * Half-life: thời gian để hot score giảm xuống 50%
   * Mặc định: 7 ngày = 168 giờ
   *
   * Ví dụ:
   * - 3 ngày = 72 giờ (hot stories thay đổi nhanh hơn)
   * - 7 ngày = 168 giờ (mở rộng hơn)
   * - 14 ngày = 336 giờ (hot story tồn tại lâu hơn)
   */
  HALF_LIFE_HOURS: 168,

  /**
   * Trọng số cho rating average (0-5)
   */
  RATING_AVERAGE_WEIGHT: 1,

  /**
   * Trọng số cho số lượng người đánh giá
   * Để tránh truyện có 1 đánh giá 5 sao vượt qua truyện có 1000 đánh giá 4.5 sao
   * Sử dụng log để giảm ảnh hưởng của số lượng quá lớn
   */
  RATING_COUNT_WEIGHT: 0.5,

  /**
   * Trọng số cho số lượng bình luận
   */
  COMMENT_COUNT_WEIGHT: 0.3,

  /**
   * Trọng số cho số lượng lượt xem
   */
  VIEW_COUNT_WEIGHT: 0.1,
} as const;

export const STORY_EXCEL_COLUMNS: ExcelColumnDef<Story>[] = [
  { header: 'ID', key: 'id', width: 8 },
  { header: 'Title', key: 'title', width: 35, required: true },
  { header: 'Slug', key: 'slug', width: 30, required: true },
  { header: 'Author', key: 'authorName', width: 25 },
  { header: 'Description', key: 'description', width: 50 },
  {
    header: 'Status',
    key: 'status',
    width: 15,
    required: true,
    // export: giữ nguyên enum value (draft / published / archived)
    parse: (v) => {
      const val = String(v).toLowerCase();
      if (Object.values(StoryStatus).includes(val as StoryStatus)) return val;
      return StoryStatus.DRAFT; // fallback
    },
  },
  {
    header: 'Progress',
    key: 'progress',
    width: 15,
    required: true,
    parse: (v) => {
      const val = String(v).toLowerCase();
      if (Object.values(StoryProgress).includes(val as StoryProgress))
        return val;
      return StoryProgress.ONGOING;
    },
  },
  { header: 'Cover Image', key: 'coverImage', width: 50 },
  {
    header: 'Tags',
    key: 'tags',
    width: 30,
    // export: ["action","romance"] → "action, romance"
    transform: (tags: Story['tags']) =>
      Array.isArray(tags) ? tags.map((t) => t.name).join(', ') : '',
    // import: "action, romance" — chỉ lưu tên, resolve ở service
    parse: (v) =>
      v
        ? String(v)
            .split(',')
            .map((s) => s.trim())
        : [],
  },
  {
    header: 'View Count',
    key: 'viewCount',
    width: 12,
    transform: (v) => v ?? 0,
    parse: (v) => Number(v) || 0,
  },
  {
    header: 'Avg Rating',
    key: 'averageRating',
    width: 12,
    transform: (v) => v ?? 0,
    parse: (v) => Number(v) || 0,
  },
];
