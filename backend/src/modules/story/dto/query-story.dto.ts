import { QUERY_SEPARATORS } from '@/common';
import { QueryBaseDto } from '@/common/dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { StoryProgress, StoryStatus } from '../entities/story.entity';

export class QueryStoryDto extends QueryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by story status',
    enum: StoryStatus,
    example: StoryStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;

  @ApiPropertyOptional({
    description: 'Filter by story progress',
    enum: StoryProgress,
    example: StoryProgress.ONGOING,
  })
  @IsOptional()
  @IsEnum(StoryProgress)
  progress?: StoryProgress;

  @ApiPropertyOptional({
    description: 'Filter by tag IDs (comma-separated)',
    example: '1,2,3',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value.split(QUERY_SEPARATORS.LIST).map((v: string) => Number(v)),
  )
  @IsNumber({}, { each: true })
  tagIds?: number[];
}
