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
      form.reset({ ...storyData.payload });
    } else {
      form.reset({
        slug: "",
        title: "",
        tagIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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

  // Kiểm lỗi
  // useEffect(() => {
  //   if (Object.keys(form.formState.errors).length > 0) {
  //     console.log("Form errors:", form.formState.errors);
  //   }
  // }, [form.formState.errors]);

  return {
    form,
    storyData,
    isDirty: form.formState.isDirty,
  };
}
