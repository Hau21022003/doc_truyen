import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Control, Controller } from "react-hook-form";
import { CHAPTER_STATUS_VALUES } from "../../chapter.constants";
import { UpsertChapterInput } from "../../chapter.schema";

interface UpsertChapterBasicInfoProps {
  control: Control<UpsertChapterInput>;
}

export function UpsertChapterBasicInfo({
  control,
}: UpsertChapterBasicInfoProps) {
  const tChapter = useTranslations("chapter");

  return (
    <>
      {/* Title + Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-title">
                {tChapter("upsert.fields.title.label")}
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-title"
                aria-invalid={fieldState.invalid}
                placeholder={tChapter("upsert.fields.title.placeholder")}
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
                {tChapter("upsert.fields.slug.label")}
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-slug"
                aria-invalid={fieldState.invalid}
                placeholder={tChapter("upsert.fields.slug.placeholder")}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* Chapter Number + Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
        <Controller
          name="chapterNumber"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-chapterNumber">
                {tChapter("upsert.fields.chapterNumber.label")}
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-chapterNumber"
                type="number"
                inputMode="numeric"
                aria-invalid={fieldState.invalid}
                placeholder={tChapter(
                  "upsert.fields.chapterNumber.placeholder",
                )}
                autoComplete="off"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-status">
                {tChapter("upsert.fields.status.label")}
              </FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="form-rhf-status">
                  <SelectValue
                    placeholder={tChapter("upsert.fields.status.placeholder")}
                  />
                </SelectTrigger>

                <SelectContent className="max-h-60 overflow-y-auto">
                  {CHAPTER_STATUS_VALUES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {tChapter(`statusConstants.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </>
  );
}
