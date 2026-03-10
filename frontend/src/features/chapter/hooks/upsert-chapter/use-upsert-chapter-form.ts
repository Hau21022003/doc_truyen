import { useStoryQuery } from "@/features/story/story.query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useChapterQuery } from "../../chapter.query";
import { UpsertChapterInput, upsertChapterSchema } from "../../chapter.schema";

export function useUpsertChapterForm(chapterId?: number, storyId?: number) {
  const form = useForm<UpsertChapterInput>({
    resolver: zodResolver(upsertChapterSchema),
  });

  const { data: chapterData } = useChapterQuery(chapterId);
  const { data: storyData } = useStoryQuery(storyId);

  // Reset form khi data load
  useEffect(() => {
    if (chapterId && chapterData) {
      form.reset({ ...chapterData.payload, storyId });
    } else {
      form.reset({ storyId, contents: [], slug: "", title: "" });
    }
  }, [chapterId, chapterData, storyId, form]);

  return {
    form,
    chapterData,
    storyData,
    isDirty: form.formState.isDirty,
  };
}
