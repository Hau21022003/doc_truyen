"use client";

import { IconCamera, IconLoading } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UpsertMode, useFileUpload } from "@/hooks";
import { getErrorMessage, handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMAGE_TYPES_STRING,
  IMAGE_FORMAT_LABELS,
  MAX_SIZE_MB,
} from "@/shared/constants";
import mediaService from "@/shared/services/media.service";
import { toSlug } from "@/shared/utils";
import { imageUtils } from "@/shared/utils/image.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { STORY_PROGRESS_VALUES, STORY_STATUS_VALUES } from "../story.constants";
import {
  useCreateStoryMutation,
  useUpdateStoryMutation,
} from "../story.mutation";
import { UpsertStoryInput, upsertStorySchema } from "../story.schema";
import { Story } from "../story.types";

interface UpsertStoryModalProps {
  isOpen: boolean;
  mode: UpsertMode;
  data: Story | null;
  onClose: () => void;
}

export default function UpsertStoryModal({
  data,
  isOpen,
  mode,
  onClose,
}: UpsertStoryModalProps) {
  const tStory = useTranslations("story");
  const tModal = useTranslations("story.upsertModal");
  const tCommon = useTranslations("common");

  const form = useForm<UpsertStoryInput>({
    resolver: zodResolver(upsertStorySchema),
    defaultValues: {},
  });
  const [imageUrl, setImageUrl] = useState<string | null>();

  const { mutateAsync: createStory, isPending: isCreating } =
    useCreateStoryMutation();
  const { mutateAsync: updateStory, isPending: isUpdating } =
    useUpdateStoryMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (mode === "edit" && data) {
      form.reset(data);
      setImageUrl(data.coverImage);
    } else {
      form.reset({});
    }
  }, [mode, data, form]);

  const onSubmit = async (values: UpsertStoryInput) => {
    try {
      if (mode === "create") {
        // call create API
        await createStory(values);
      } else if (mode === "edit" && data) {
        // call update API
        await updateStory({ id: data.id, data: values });
      }

      onClose();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const handleFileSelect = async (file: File) => {
    await toast.promise(mediaService.upload(file), {
      loading: tCommon("actions.uploading"),
      success: ({ tempId, url }) => {
        form.setValue("coverImageTempId", tempId, { shouldDirty: true });
        setImageUrl(url);
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

  const titleValue = useWatch({
    control: form.control,
    name: "title",
  });

  useEffect(() => {
    if (mode === "create") {
      form.setValue("slug", toSlug(titleValue || ""), {
        shouldDirty: true,
      });
    }
  }, [titleValue, mode, form]);

  const isChanged = form.formState.isDirty;

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="items-center">
          <DialogTitle>
            {mode === "create" ? tModal("createTitle") : tModal("editTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-30 h-30">
              {imageUrl ? (
                <img
                  src={imageUtils.optimizeCloudinary(imageUrl, {
                    width: 120,
                    height: 120,
                  })}
                  alt={"coverImage"}
                  className="w-full h-full rounded-md object-cover"
                />
              ) : (
                <button
                  onClick={openFileDialog}
                  className="cursor-pointer w-full h-full rounded-md border border-border border-dashed flex justify-center items-center"
                >
                  <IconCamera color="muted" size={"xl"} />
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
            {imageUrl && (
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

        <form id="form-rhf-upsert" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-title">
                    {tModal("fields.title.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-title"
                    aria-invalid={fieldState.invalid}
                    placeholder={tModal("fields.title.placeholder")}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-7">
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-slug">
                      {tModal("fields.slug.label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-slug"
                      aria-invalid={fieldState.invalid}
                      placeholder={tModal("fields.slug.placeholder")}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="authorName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-author-name">
                      {tModal("fields.authorName.label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-author-name"
                      aria-invalid={fieldState.invalid}
                      placeholder={tModal("fields.authorName.placeholder")}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-description">
                    {tModal("fields.description.label")}
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-description"
                    aria-invalid={fieldState.invalid}
                    placeholder={tModal("fields.description.placeholder")}
                    autoComplete="off"
                    className="resize-none max-h-20 md:max-h-30 overflow-y-auto"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Select progress - status */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-status">
                      {tModal("fields.status.label")}
                    </FieldLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="form-rhf-status">
                        <SelectValue
                          placeholder={tModal("fields.status.placeholder")}
                        />
                      </SelectTrigger>

                      <SelectContent className="max-h-60 overflow-y-auto">
                        {STORY_STATUS_VALUES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {tStory(`statusConstants.${status}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="progress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-progress">
                      {tModal("fields.progress.label")}
                    </FieldLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="form-rhf-progress">
                        <SelectValue
                          placeholder={tModal("fields.progress.placeholder")}
                        />
                      </SelectTrigger>

                      <SelectContent className="max-h-60 overflow-y-auto">
                        {STORY_PROGRESS_VALUES.map((progress) => (
                          <SelectItem key={progress} value={progress}>
                            {tStory(`progressConstants.${progress}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose className="md:block hidden" asChild>
            <Button type="button" variant="outline">
              {tCommon("actions.close")}
            </Button>
          </DialogClose>
          <Button
            disabled={!isChanged || isLoading}
            type="submit"
            form="form-rhf-upsert"
          >
            {isLoading && (
              <IconLoading className="animate-spin" color="custom" />
            )}
            {mode === "create"
              ? isLoading
                ? tCommon("actions.creating")
                : tCommon("actions.create")
              : isLoading
                ? tCommon("actions.updating")
                : tCommon("actions.update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
