import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  // Soft delete
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;
}
