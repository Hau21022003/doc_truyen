import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ChapterStatus } from '../entities/chapter.entity';

export class UpdateChapterStatusDto {
  @ApiProperty({
    description: 'Trạng thái mới của chapter',
    enum: ChapterStatus,
  })
  @IsEnum(ChapterStatus)
  status: ChapterStatus;
}
