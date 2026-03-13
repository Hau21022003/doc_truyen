import { PaginationDto } from '@/common';
import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type JwtPayload } from '../auth/types/jwt-payload.type';
import { ReadingHistoryService } from './reading-history.service';

@Controller('reading-history')
export class ReadingHistoryController {
  constructor(private readonly readingHistoryService: ReadingHistoryService) {}
  @Get()
  async findMyHistory(
    @CurrentUser() user: JwtPayload,
    @Query() query: PaginationDto,
  ) {
    return this.readingHistoryService.findByUser(user.sub, query);
  }
}
