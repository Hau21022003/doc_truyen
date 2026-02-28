import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * Base entity cho các entities sử dụng ID kiểu UUID
 * Phù hợp cho các entities cần bảo mật cao, truy vết xuyên suốt hệ thống
 * Ví dụ: User, Story, Transaction, Rating...
 */
export abstract class UuidBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;
}
