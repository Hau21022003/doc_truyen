import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingHistory } from './entities/reading-history.entity';
import { ReadingHistoryController } from './reading-history.controller';
import { ReadingHistoryService } from './reading-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingHistory])],
  controllers: [ReadingHistoryController],
  providers: [ReadingHistoryService],
  exports: [ReadingHistoryService],
})
export class ReadingHistoryModule {}
