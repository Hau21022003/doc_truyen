import { toSlug } from "@/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useStoryQuery } from "../../story.query";
import { UpsertStoryInput, upsertStorySchema } from "../../story.schema";

export function useUpsertStoryForm(storyId?: number) {
  const form = useForm<UpsertStoryInput>({
    resolver: zodResolver(upsertStorySchema),
  });

  const { data: storyData } = useStoryQuery(storyId);

  // Reset form khi data load
  useEffect(() => {
    if (storyId && storyData) {
      const tags = storyData.payload?.tags || [];
      const tagIds = tags.map((tag) => tag.id);
      form.reset({ ...storyData.payload, tagIds });
    } else {
      form.reset({
        slug: "",
        title: "",
        tagIds: [],
        description: "",
        authorName: "",
      });
    }
  }, [storyId, storyData, form]);

  // Auto tạo slug dựa trên title
  const titleValue = useWatch({
    control: form.control,
    name: "title",
  });
  useEffect(() => {
    if (storyId) {
      form.setValue("slug", toSlug(titleValue || ""), {
        shouldDirty: true,
      });
    }
  }, [titleValue, storyId, form]);

  return {
    form,
    storyData,
    isDirty: form.formState.isDirty,
  };
}
