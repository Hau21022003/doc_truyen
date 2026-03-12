import { IntegerIdBaseEntity } from '@/common';
import { Story } from '@/modules/story/entities/story.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Max, Min } from 'class-validator';
import { Check, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('story_rating')
@Check(`"rating" >= 1 AND "rating" <= 5`)
@Index(['userId', 'storyId'], { unique: true }) // 1 user chỉ rate 1 lần
@Index(['storyId'])
export class StoryRating extends IntegerIdBaseEntity {
  @Column()
  userId: string;

  @Column()
  storyId: number;

  @Column({
    type: 'int',
  })
  @Min(1)
  @Max(5)
  rating: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Story, (story) => story.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storyId' })
  story: Story;
}
