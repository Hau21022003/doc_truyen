import { IsExist } from '@/common';
import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStoryCommentDto {
  @ApiProperty({
    description: 'ID của story muốn comment',
    example: 1,
  })
  @IsNotEmpty()
  @IsExist(Story, 'id')
  storyId: number;

  @ApiProperty({
    description: 'ID của chapter muốn comment',
    example: 1,
  })
  @IsOptional()
  @IsExist(Chapter, 'id')
  chapterId: number;

  @ApiProperty({
    description: 'Nội dung comment',
    example: 'Truyện rất hay!',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: 'Tên hiển thị cho người chưa đăng nhập',
    example: 'Khách',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  guestName?: string;

  // @ApiProperty({
  //   description: 'ID comment cha (để reply)',
  //   example: 123,
  //   required: false,
  // })
  // @IsOptional()
  // parentCommentId?: number;
}
