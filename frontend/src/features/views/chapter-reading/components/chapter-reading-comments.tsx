import { Chapter } from "@/features/data/chapter/chapter.types";
import StoryCommentForm from "@/features/data/story-comment/components/story-comment-form";
import StoryCommentList from "@/features/data/story-comment/components/story-comment-list";

export function ChapterReadingComments({ chapter }: { chapter: Chapter }) {
  return chapter.story ? (
    <section className="space-y-2">
      <StoryCommentForm storyId={chapter.story.id} chapterId={chapter.id} />

      <StoryCommentList storyId={chapter.story.id} chapterId={chapter.id} />
    </section>
  ) : null;
}
