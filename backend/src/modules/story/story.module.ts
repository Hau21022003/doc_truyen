import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { TagsModule } from '../tags/tags.module';
import { Story } from './entities/story.entity';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';

@Module({
  imports: [TypeOrmModule.forFeature([Story]), TagsModule, MediaModule],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
