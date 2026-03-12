"use client";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useAllTagsQuery } from "@/features/tags/tags.query";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { UpsertStoryInput } from "../../story.schema";

interface UpsertStoryTagSelectProps {
  form: UseFormReturn<UpsertStoryInput>;
}
export function UpsertStoryTagSelect({ form }: UpsertStoryTagSelectProps) {
  const tModal = useTranslations("story.upsertModal");
  const { data: tagsData } = useAllTagsQuery();
  const tags = tagsData?.payload || [];
  const anchor = useComboboxAnchor();

  const items = tags.map((tag) => ({
    label: tag.name,
    value: String(tag.id),
  }));

  return (
    <Controller
      name="tagIds"
      control={form.control}
      render={({ field, fieldState }) => {
        const selectedValues = field.value?.map((id) => String(id)) ?? [];

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-tag">
              {tModal("fields.tags.label")}
            </FieldLabel>

            <Combobox
              multiple
              autoHighlight
              items={items}
              value={selectedValues}
              onValueChange={(values) => {
                field.onChange(values.map(Number));
              }}
            >
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((value: string) => {
                        const item = items.find((i) => i.value === value);

                        return (
                          <ComboboxChip key={value}>{item?.label}</ComboboxChip>
                        );
                      })}
                      <ComboboxChipsInput />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No tags found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item.value}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
