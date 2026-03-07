import {
  ChapterContent,
  ContentType,
} from '@/modules/chapter/entities/chapter-content';
import { ChapterStatus } from '@/modules/chapter/entities/chapter.entity';
import {
  Story,
  StoryProgress,
  StoryStatus,
} from '@/modules/story/entities/story.entity';
import { DeepPartial, MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTags1772164077808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    const tagIdMap = {
      'hanh-dong': 1,
      'tinh-cam': 2,
      'hai-huoc': 3,
      'kinh-di': 4,
      'phieu-luu': 5,
      'vien-tuong': 6,
      'lang-man': 7,
      'gia-dinh': 8,
      'bi-an': 9,
      'toi-pham': 10,
      'lich-su': 11,
      'vo-thuat': 12,
      'hoc-duong': 13,
      'khoa-hoc': 14,
      'doi-thuong': 15,
      'truong-ca': 16,
      'ngon-tinh': 17,
      'co-tich': 18,
      'than-thoai': 19,
      fantasy: 20,
    } as const;

    const storyCreatedDates = {
      doraemon: new Date(Date.now() - 30 * ONE_DAY_MS),
      troThanhHoanTu: new Date(Date.now() - 26 * ONE_DAY_MS),
      nghichTien: new Date(Date.now() - 50 * ONE_DAY_MS),
    } as const;

    const getContents = (
      items: {
        type: ContentType;
        data: string;
      }[],
      createdAt: Date,
    ): Partial<ChapterContent>[] => {
      return items.map((item, index) => ({
        position: index,
        createdAt,
        updatedAt: createdAt,
        contentType: item.type,
        ...(item.type === ContentType.IMAGE
          ? { imageUrl: item.data }
          : { text: item.data }),
      }));
    };

    const stories: DeepPartial<Story>[] = [
      {
        title: 'Truyện tranh Doremon',
        slug: 'truyen-tranh-doraemon',
        description:
          'Bộ truyện được xem là huyền thoại của Nhật Bản. Nói về cuộc sống của một chú nhóc tên Nobita, tính tình hậu đậu và chú mèo máy Doremon đến từ thế kỉ 22 cùng những người bạn Xuka, Chaien, Xeko; để từ đó gây ra bao tiếng cười và rút ra những bài học ý nghĩa cho người xem !!',
        coverImage:
          'https://res.cloudinary.com/dvydk3lew/image/upload/v1772619337/story/nhasachmienphi-truyen-tranh-doremon-1772619335145.jpg',
        authorName: 'Fujiko F. Fujio',
        status: StoryStatus.PUBLISHED,
        progress: StoryProgress.ONGOING,
        viewCount: 15234,
        createdAt: storyCreatedDates.doraemon,
        updatedAt: storyCreatedDates.doraemon,
        lastAddedChapterDate: storyCreatedDates.doraemon,

        tags: [{ id: tagIdMap['co-tich'] }, { id: tagIdMap['co-tich'] }],
        chapters: [
          {
            chapterNumber: 1,
            createdAt: storyCreatedDates.doraemon,
            updatedAt: storyCreatedDates.doraemon,
            publishedAt: storyCreatedDates.doraemon,
            status: ChapterStatus.PUBLISHED,
            title: 'Tập 1 – Chương 1: Doremon đã đến với Nobita như thế nào?',
            slug: 'tap-1-chuong-1',
            contents: getContents(
              [
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772622669/story/nhasachmienphi-truyen-tranh-doremon-333102-0-1772622666627.png',
                },
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772622736/story/nhasachmienphi-truyen-tranh-doremon-333102-4-1772622733564.png',
                },
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772623321/story/nhasachmienphi-truyen-tranh-doremon-333102-5-1772623318121.png',
                },
              ],
              storyCreatedDates.doraemon,
            ),
          },
          {
            chapterNumber: 2,
            createdAt: storyCreatedDates.doraemon,
            updatedAt: storyCreatedDates.doraemon,
            publishedAt: storyCreatedDates.doraemon,
            status: ChapterStatus.PUBLISHED,
            title: 'Tập 1 – Chương 3: Bánh quy biến hình',
            slug: 'tap-1-chuong-3:-banh-quy-bien-hinh',
            contents: getContents(
              [
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772623515/story/nhasachmienphi-truyen-tranh-doremon-333104-0-1772623512847.png',
                },
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772623543/story/nhasachmienphi-truyen-tranh-doremon-333104-1-1772623541270.png',
                },
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772623602/story/nhasachmienphi-truyen-tranh-doremon-333104-2-1772623597157.png',
                },
              ],
              storyCreatedDates.doraemon,
            ),
          },
        ],
      },
      {
        title: 'Trở Thành Đại Hoàng Tử: Huyền Thoại Kiếm Ca',
        slug: 'tro-thanh-dai-hoan-tu:-huyen-thoai-kiem-ca',
        description:
          'Trở Thành Đại Hoàng Tử: Huyền Thoại Kiếm Ca là bộ truyện thuộc thể loại Action, Chuyển Sinh, Fantasy, Manhwa, Tu Tiên, được sáng tác bởi Pandora và chuyển ngữ bởi Gió Đông Team. Tác phẩm nhanh chóng thu hút sự quan tâm của cộng đồng độc giả nhờ nội dung hấp dẫn, diễn biến lôi cuốn và hệ thống nhân vật xây dựng chỉn chu. Hiện tại, truyện đã đạt hơn 0 lượt theo dõi và vẫn đang được cập nhật đều đặn. Chương mới nhất là Chương 25, được cập nhật vào ngày 04/03/2026, giúp người đọc dễ dàng nắm bắt kịp thời diễn biến mới nhất của câu chuyện. Điểm nổi bật của Trở Thành Đại Hoàng Tử: Huyền Thoại Kiếm Ca nằm ở cách triển khai tình huống hợp lý, kết hợp giữa yếu tố giải trí và cảm xúc, mang đến trải nghiệm đọc mượt mà. Bản dịch từ Gió Đông Team cũng góp phần giữ vững tinh thần nguyên tác, tạo cảm giác thân thuộc và dễ tiếp cận cho độc giả. Đọc ngay Trở Thành Đại Hoàng Tử: Huyền Thoại Kiếm Ca để không bỏ lỡ những diễn biến hấp dẫn! Nhấn Theo dõi ZetTruyen để cập nhật chương mới sớm nhất!',
        coverImage:
          'https://res.cloudinary.com/dvydk3lew/image/upload/v1772637091/story/tro-thanh-dai-hoang-tu-huyen-thoai-kiem-ca-1772637088023.png',
        authorName: 'Pandora',
        status: StoryStatus.PUBLISHED,
        progress: StoryProgress.ONGOING,
        viewCount: 15234,
        createdAt: storyCreatedDates.troThanhHoanTu,
        updatedAt: storyCreatedDates.troThanhHoanTu,
        lastAddedChapterDate: storyCreatedDates.troThanhHoanTu,

        tags: [
          { id: tagIdMap['than-thoai'] },
          { id: tagIdMap['hanh-dong'] },
          { id: tagIdMap['phieu-luu'] },
        ],
        chapters: [
          {
            chapterNumber: 1,
            createdAt: storyCreatedDates.troThanhHoanTu,
            updatedAt: storyCreatedDates.troThanhHoanTu,
            publishedAt: storyCreatedDates.troThanhHoanTu,
            status: ChapterStatus.PUBLISHED,
            title: 'Chapter 1',
            slug: 'chapter-1',
            contents: getContents(
              [
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772637368/story/0-1772637365673.webp',
                },
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772637479/story/1-1772637476042.webp',
                },
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772637479/story/2-1772637506572.webp',
                },
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772637540/story/3-1772637537733.webp',
                },
              ],
              storyCreatedDates.troThanhHoanTu,
            ),
          },
          {
            chapterNumber: 2,
            createdAt: storyCreatedDates.troThanhHoanTu,
            updatedAt: storyCreatedDates.troThanhHoanTu,
            publishedAt: storyCreatedDates.troThanhHoanTu,
            status: ChapterStatus.PUBLISHED,
            title: 'Chapter 2',
            slug: 'chapter-2',
            contents: getContents(
              [
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772638461/story/0--1--1772638458011.webp',
                },
                {
                  type: ContentType.IMAGE,
                  data: 'https://res.cloudinary.com/dvydk3lew/image/upload/v1772638559/story/1--1--1772638556114.webp',
                },
              ],
              storyCreatedDates.troThanhHoanTu,
            ),
          },
        ],
      },
      {
        title: 'Nghịch Tiên',
        slug: 'nghich-tien',
        description:
          'Tiên Nghịch là câu chuyện Tiên Hiệp kể về Vương Lâm - một thiếu niên bình thường, may mắn được gia nhập vào một môn phái tu tiên xuống dốc của nước Triệu, vì thiếu linh căn, vì một hiểu nhầm tai hại, vì một khối thiết tinh và nhờ có được một "Thần Bí Hạt Châu". Vương Lâm đã bước lên con đường tu tiên và trên con đường này, hắn sẽ đối mặt với chuyện gì?',
        coverImage:
          'https://res.cloudinary.com/dvydk3lew/image/upload/v1772638909/story/truyen-tien-hiep-hay-6-1772638906088.jpg',
        authorName: 'Nhĩ Căn',
        status: StoryStatus.PUBLISHED,
        progress: StoryProgress.ONGOING,
        viewCount: 15234,
        createdAt: storyCreatedDates.nghichTien,
        updatedAt: storyCreatedDates.nghichTien,
        lastAddedChapterDate: storyCreatedDates.nghichTien,

        tags: [{ id: tagIdMap['than-thoai'] }, { id: tagIdMap['phieu-luu'] }],
        chapters: [
          {
            chapterNumber: 1,
            createdAt: storyCreatedDates.nghichTien,
            updatedAt: storyCreatedDates.nghichTien,
            publishedAt: storyCreatedDates.nghichTien,
            status: ChapterStatus.PUBLISHED,
            title: 'Chương 1: Ly hương',
            slug: 'chuong-1:-ly-huong',
            contents: getContents(
              [
                {
                  type: ContentType.TEXT,
                  data: '"Thiết Trụ ngồi ở bên con đường nhỏ trong thôn, vẻ mặt ngẩn ngơ nhìn bầu trời xanh thẳm, Thiết Trụ vốn không phải là tên thật của hắn, mà là từ bé bởi vì thân thể gầy yếu, phụ thân sợ nuôi không được, vì thế dựa theo tập tục mà gọi tên mụ." <br> "Hắn vốn tên là Vương Lâm, họ Vương ở trong vài cái thôn xóm xung quanh xem như danh gia, tổ tiên xuất thân thợ mộc, nhất là ở thị trấn, gia tộc họ Vương cũng coi như rất có danh tiếng, có được mấy cửa hiệu chuyên môn bán sản phẩm gỗ."<br>"Phụ thân Thiết Trụ là con thứ vợ lẻ bên trong gia tộc, không được phép tiếp quản việc quan trọng của gia tộc, mà là ở sau khi thành hôn rời đi thị trấn, định cư tại thôn trang này."',
                },
              ],
              storyCreatedDates.nghichTien,
            ),
          },
          {
            chapterNumber: 2,
            createdAt: storyCreatedDates.nghichTien,
            updatedAt: storyCreatedDates.nghichTien,
            publishedAt: storyCreatedDates.nghichTien,
            status: ChapterStatus.PUBLISHED,
            title: 'Chương 2: Tiên Nhân',
            slug: 'chuong-2-tien-nhan',
            contents: getContents(
              [
                {
                  type: ContentType.TEXT,
                  data: '"https://res.cloudinary.com/dvydk3lew/image/upload/v1772623515/story/nhasachmienphi-truyen-tranh-doremon-333104-0-1772623512847.png" <br>"Nơi đây cách thị trấn một khoản lộ trình không ngắn, Vương Lâm dần dần thiếp đi, cũng không biết trải qua bao lâu, hắn bị người ta nhẹ nhàng thúc đẩy, vừa mở mắt thấy, khuôn mặt tứ thúc mang theo mỉm cười nhìn hắn, trêu ghẹo nói:"',
                },
              ],
              storyCreatedDates.nghichTien,
            ),
          },
        ],
      },
    ];

    for (const story of stories) {
      const result = await queryRunner.query(
        `
        INSERT INTO "story"
        ("title","description","coverImage","authorName","status","progress","viewCount","createdAt","updatedAt","lastAddedChapterDate","slug")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING id
        `,
        [
          story.title,
          story.description,
          story.coverImage,
          story.authorName,
          story.status,
          story.progress,
          story.viewCount,
          story.createdAt,
          story.updatedAt,
          story.lastAddedChapterDate,
          story.slug,
        ],
      );

      const storyId = result[0].id;

      // Insert story-tag relationships
      if (story.tags) {
        for (const tag of story.tags) {
          await queryRunner.query(
            `
            INSERT INTO "story_tags_tag" ("storyId", "tagId")
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            `,
            [storyId, tag.id],
          );
        }
      }

      // Insert chapters and their contents
      if (story.chapters) {
        for (const chapter of story.chapters) {
          // Insert chapter
          const chapterResult = await queryRunner.query(
            `
            INSERT INTO "chapter"
            ("title","chapterNumber","status","storyId","publishedAt","createdAt","updatedAt","slug")
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING id
            `,
            [
              chapter.title,
              chapter.chapterNumber,
              chapter.status,
              storyId,
              chapter.publishedAt,
              chapter.createdAt,
              chapter.updatedAt,
              chapter.slug,
            ],
          );

          const chapterId = chapterResult[0].id;

          // Insert chapter contents
          if (chapter.contents) {
            for (const content of chapter.contents) {
              await queryRunner.query(
                `
                INSERT INTO "chapter_content"
                ("position","contentType","textContent","imageUrl","chapterId","createdAt","updatedAt")
                VALUES ($1,$2,$3,$4,$5,$6,$7)
                `,
                [
                  content.position,
                  content.contentType,
                  content.textContent, // textContent might be null for IMAGE type
                  content.imageUrl, // imageUrl might be null for TEXT type
                  chapterId,
                  content.createdAt,
                  content.updatedAt,
                ],
              );
            }
          }
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // List of story titles to delete
    const storyTitles = [
      'Truyện tranh Doremon',
      // Add more story titles here when you extend the migration
    ];

    // Delete stories by titles
    // This will automatically delete related:
    // - story-tag relationships in story_tags_tag
    // - chapters (due to onDelete: 'CASCADE' in chapter entity)
    // - chapter contents (due to onDelete: 'CASCADE' in chapter_content entity)
    for (const title of storyTitles) {
      await queryRunner.query(`DELETE FROM "story" WHERE title = $1`, [title]);
    }
  }
}
