import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Base entity cho các entities sử dụng ID kiểu integer (number)
 * Phù hợp cho các entities nội bộ, không cần bảo mật cao, ưu tiên hiệu năng
 * Ví dụ: Genre, Category, Tag, Chapter...
 */
export abstract class IntegerIdBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}