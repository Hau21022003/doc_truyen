import { IntegerIdBaseEntity } from '@/common';
import { Column, Entity, Index } from 'typeorm';
import { MediaStatus, MediaUsage } from '../constants/media.constants';

@Entity('media')
export class Media extends IntegerIdBaseEntity {
  @Column()
  publicId: string; // dành cho xóa ảnh trên cloudinary

  @Column()
  url: string;

  @Column({ type: 'enum', enum: MediaUsage, nullable: true })
  usage: MediaUsage | null;

  @Column({ type: 'enum', enum: MediaStatus, default: MediaStatus.DRAFT })
  status: MediaStatus;

  @Index()
  @Column({ nullable: true, type: 'varchar' })
  tempId: string | null;
}
