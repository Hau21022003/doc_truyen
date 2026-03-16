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
} as const;
