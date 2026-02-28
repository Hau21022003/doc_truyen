import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTags1772164077807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "tag" ("name", "slug", "storyCount", "createdAt", "updatedAt") VALUES
      ('Hành động', 'hanh-dong', 0, NOW(), NOW()),
      ('Tình cảm', 'tinh-cam', 0, NOW(), NOW()),
      ('Hài hước', 'hai-huoc', 0, NOW(), NOW()),
      ('Kinh dị', 'kinh-di', 0, NOW(), NOW()),
      ('Phiêu lưu', 'phieu-luu', 0, NOW(), NOW()),
      ('Viễn tưởng', 'vien-tuong', 0, NOW(), NOW()),
      ('Lãng mạn', 'lang-man', 0, NOW(), NOW()),
      ('Gia đình', 'gia-dinh', 0, NOW(), NOW()),
      ('Bí ẩn', 'bi-an', 0, NOW(), NOW()),
      ('Tội phạm', 'toi-pham', 0, NOW(), NOW()),
      ('Lịch sử', 'lich-su', 0, NOW(), NOW()),
      ('Võ thuật', 'vo-thuat', 0, NOW(), NOW()),
      ('Học đường', 'hoc-duong', 0, NOW(), NOW()),
      ('Khoa học', 'khoa-hoc', 0, NOW(), NOW()),
      ('Đời thường', 'doi-thuong', 0, NOW(), NOW()),
      ('Trường ca', 'truong-ca', 0, NOW(), NOW()),
      ('Ngôn tình', 'ngon-tinh', 0, NOW(), NOW()),
      ('Cổ tích', 'co-tich', 0, NOW(), NOW()),
      ('Thần thoại', 'than-thoai', 0, NOW(), NOW()),
      ('Fantasy', 'fantasy', 0, NOW(), NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "tag" WHERE slug IN (
      'hanh-dong', 'tinh-cam', 'hai-huoc', 'kinh-di', 'phieu-luu',
      'vien-tuong', 'lang-man', 'gia-dinh', 'bi-an', 'toi-pham',
      'lich-su', 'vo-thuat', 'hoc-duong', 'khoa-hoc', 'doi-thuong',
      'truong-ca', 'ngon-tinh', 'co-tich', 'than-thoai', 'fantasy'
    )`);
  }
}
