"use client";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Control, Controller } from "react-hook-form";
import {
  STORY_PROGRESS_VALUES,
  STORY_STATUS_VALUES,
} from "../../story.constants";
import { UpsertStoryInput } from "../../story.schema";

interface StoryStatusProgressProps {
  control: Control<UpsertStoryInput>;
}
export function UpsertStoryStatusProgress({
  control,
}: StoryStatusProgressProps) {
  const tStory = useTranslations("story");
  const tModal = useTranslations("story.upsertModal");
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-4">
      <Controller
        name="status"
        control={control}
        render={({ field, fieldState }) => (
          <Field className="w-full" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-status">
              {tModal("fields.status.label")}
            </FieldLabel>

            <Select
              onValueChange={field.onChange}
              value={field.value}
              key={field.value || "status-empty"}
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

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="progress"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-progress">
              {tModal("fields.progress.label")}
            </FieldLabel>

            <Select
              onValueChange={field.onChange}
              value={field.value}
              key={field.value || "progress-empty"}
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

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
