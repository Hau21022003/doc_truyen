"use client";
import { IconCamera } from "@/components/icons";
import { FieldLabel } from "@/components/ui/field";
import { useFileUpload, useIsMobile } from "@/hooks";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMAGE_TYPES_STRING,
  IMAGE_FORMAT_LABELS,
  MAX_SIZE_MB,
} from "@/shared/constants";
import mediaService from "@/shared/services/media.service";
import { imageUtils } from "@/shared/utils/image.utils";
import { useTranslations } from "next-intl";
import { UseFormReturn, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { UpsertStoryInput } from "../../story.schema";

interface StoryCoverUploadProps {
  form: UseFormReturn<UpsertStoryInput>;
  className?: string;
}
export function UpsertStoryCoverUpload({
  form,
  className = "",
}: StoryCoverUploadProps) {
  // i18n
  const tCommon = useTranslations("common");
  const tModal = useTranslations("story.upsertModal");

  const isMobile = useIsMobile();

  // Image Upload
  const handleFileSelect = async (file: File) => {
    await toast.promise(mediaService.upload(file), {
      loading: tCommon("actions.uploading"),
      success: ({ tempId, url }) => {
        form.setValue("coverImageTempId", tempId, { shouldDirty: true });
        form.setValue("coverImage", url, { shouldDirty: true });
        return tCommon("upload.uploadSuccess");
      },
      error: (err) => getErrorMessage(err) || tCommon("upload.uploadFailed"),
    });
  };

  const { inputRef, onFileChange, openFileDialog } = useFileUpload({
    accept: ALLOWED_IMAGE_TYPES,
    maxSizeMB: MAX_SIZE_MB.DOCUMENT,
    onFileSelected: handleFileSelect,
  });

  const coverImage = useWatch({
    control: form.control,
    name: "coverImage",
  });

  return (
    <>
      <div className={cn("flex items-start gap-4", className)}>
        <div className="relative shrink-0">
          <div className="w-30 h-30 md:w-40 md:h-40">
            {coverImage ? (
              <img
                src={imageUtils.optimizeCloudinary(coverImage, {
                  width: 160,
                  height: 160,
                })}
                alt={"coverImage"}
                className="w-full h-full rounded-md object-cover"
              />
            ) : (
              <button
                onClick={openFileDialog}
                className="cursor-pointer w-full h-full rounded-md border border-border border-dashed flex justify-center items-center"
              >
                <IconCamera color="muted" size={isMobile ? "xl" : "3xl"} />
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={onFileChange}
            accept={ALLOWED_IMAGE_TYPES_STRING}
          />
          {coverImage && (
            <div
              onClick={openFileDialog}
              className={cn(
                "cursor-pointer",
                "absolute right-0 bottom-0 flex items-center justify-center",
                "rounded-full h-8 w-8 bg-gray-200 dark:bg-[#262626] ring-4 ring-white dark:ring-[#0a0a0a] ",
              )}
            >
              <IconCamera size={"sm"} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <FieldLabel htmlFor="form-rhf-title">
            {tModal("fields.coverImage.label")}
          </FieldLabel>
          <ul className="text-muted-foreground text-sm mt-2 list-disc pl-5">
            <li>
              {tCommon("upload.supportedFormats", {
                formats: IMAGE_FORMAT_LABELS.join(", "),
              })}
            </li>
            <li className="mt-1">
              {tCommon("upload.maxFileSize", {
                maxSize: `${MAX_SIZE_MB.DOCUMENT} MB`,
              })}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
