import { QueryBaseDto } from '@/common/dto/query/query-base.dto';
import { ChapterStatus } from '@/modules/chapter/entities/chapter.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class FindChaptersByStoryDto extends QueryBaseDto {
  @ApiPropertyOptional({
    enum: ChapterStatus,
    description: 'Filter by chapter status',
  })
  @IsOptional()
  @IsEnum(ChapterStatus)
  status?: ChapterStatus;
}
