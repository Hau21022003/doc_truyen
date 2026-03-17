"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  UpsertStoryBasicInfo,
  UpsertStoryCoverUpload,
  UpsertStoryHeader,
  UpsertStoryStatusProgress,
  UpsertStoryTagSelect,
} from "@/features/data/story/components/upsert-story";
import {
  useUpsertStoryForm,
  useUpsertStorySubmit,
} from "@/features/data/story/hooks/upsert-chapter";
import { useSearchParams } from "next/navigation";

export default function UpsertStoryPage() {
  // Params
  const searchParams = useSearchParams();
  const storyId = searchParams.get("storyId")
    ? Number(searchParams.get("storyId"))
    : undefined;

  // Hooks
  const { form, isDirty, storyData } = useUpsertStoryForm(storyId);
  const { isPending: isSubmitting, onSubmit } = useUpsertStorySubmit();

  return (
    <div className="p-10 md:p-14 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-7">
        <UpsertStoryHeader
          isDirty={isDirty}
          onReset={() => form.reset()}
          mode={storyId ? "edit" : "create"}
          isSubmitting={isSubmitting}
        />
        <UpsertStoryCoverUpload form={form} />
        <form
          id="form-rhf-upsert"
          onSubmit={form.handleSubmit((values) => onSubmit(values, storyId))}
        >
          <FieldGroup>
            {/* Title - Slug - AuthorName - Description */}
            <UpsertStoryBasicInfo control={form.control} />
            <UpsertStoryTagSelect form={form} />
            {/* Select progress - status */}
            <UpsertStoryStatusProgress control={form.control} />
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
