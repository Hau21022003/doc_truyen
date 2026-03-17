"use client";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  UpsertChapterBasicInfo,
  UpsertChapterContentList,
  UpsertChapterFormHeader,
} from "@/features/data/chapter/components/upsert-chapter";
import {
  useChapterContent,
  useChapterDrag,
  useUpsertChapterForm,
} from "@/features/data/chapter/hooks/upsert-chapter";
import { useUpsertChapterSubmit } from "@/features/data/chapter/hooks/upsert-chapter/use-upsert-chapter-submit";
import { useFileUpload } from "@/hooks";
import { getErrorMessage } from "@/lib/error";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMAGE_TYPES_STRING,
  MAX_SIZE_MB,
} from "@/shared/constants";
import mediaService from "@/shared/services/media.service";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export default function UpsertChapterPage() {
  // Params
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId")
    ? Number(searchParams.get("chapterId"))
    : undefined;
  const params = useParams<{ id: string }>();
  const storyId = params.id ? Number(params.id) : undefined;

  // Hooks
  const { form, chapterData, storyData, isDirty } = useUpsertChapterForm(
    chapterId,
    storyId,
  );
  const { fields, addContent, removeContent, updateContent, moveContent } =
    useChapterContent(form);
  const dragProps = useChapterDrag(fields, moveContent, form.control);

  const tCommon = useTranslations("common");

  const { isPending: isSubmitting, onSubmit } = useUpsertChapterSubmit(storyId);

  // FILE - UPLOAD
  const currentImageIndex = useRef<number | null>(null);

  const handleFileSelect = async (file: File) => {
    if (currentImageIndex.current === null) return;
    const idx = currentImageIndex.current;

    await toast.promise(mediaService.upload(file), {
      loading: tCommon("actions.uploading"),
      success: ({ tempId, url }) => {
        updateContent(idx, {
          imageTempId: tempId,
          imageUrl: url,
        });

        return tCommon("upload.uploadSuccess");
      },
      error: (err) => getErrorMessage(err) || tCommon("upload.uploadFailed"),
    });

    currentImageIndex.current = null;
  };

  const { inputRef, onFileChange, openFileDialog } = useFileUpload({
    accept: ALLOWED_IMAGE_TYPES,
    maxSizeMB: MAX_SIZE_MB.DOCUMENT,
    onFileSelected: handleFileSelect,
  });

  return (
    <div className="p-10 md:p-14 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <UpsertChapterFormHeader
          storyTitle={storyData?.payload.title}
          storyId={storyId}
          isDirty={isDirty}
          onReset={() => form.reset()}
          mode={chapterId ? "edit" : "create"}
          isSubmitting={isSubmitting}
        />

        <form
          id="form-rhf-upsert"
          onSubmit={form.handleSubmit((values) => onSubmit(values, chapterId))}
          className="mt-4"
        >
          <FieldGroup>
            {/* Title - slug */}
            <UpsertChapterBasicInfo control={form.control} />

            {/* Contents */}
            <Controller
              name="contents"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <UpsertChapterContentList
                    control={form.control}
                    fields={fields}
                    addContent={addContent}
                    removeContent={removeContent}
                    updateContent={updateContent}
                    dragProps={dragProps}
                    fileUpload={{ openFileDialog, currentImageIndex }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={onFileChange}
        accept={ALLOWED_IMAGE_TYPES_STRING}
      />
    </div>
  );
}
