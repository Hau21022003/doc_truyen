"use client";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { Control, Controller } from "react-hook-form";
import { UpsertStoryInput } from "../../story.schema";

interface StoryBasicInfoProps {
  control: Control<UpsertStoryInput>;
}
export function UpsertStoryBasicInfo({ control }: StoryBasicInfoProps) {
  const tModal = useTranslations("story.upsertModal");
  return (
    <>
      <Controller
        name="title"
        control={control}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="slug"
        control={control}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="authorName"
        control={control}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
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
              className="resize-none max-h-30 md:max-h-40 overflow-y-auto"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
