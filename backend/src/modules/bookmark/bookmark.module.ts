import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
