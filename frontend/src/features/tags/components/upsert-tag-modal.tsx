"use client";
import { IconLoading } from "@/components/icons";
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
import { UpsertMode } from "@/hooks";
import { handleErrorApi } from "@/lib/error";
import { toSlug } from "@/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useCreateTagMutation, useUpdateTagMutation } from "../tags.mutation";
import { UpsertTagInput, upsertTagSchema } from "../tags.schema";
import { Tag } from "../tags.types";

interface UpsertTagModalProps {
  isOpen: boolean;
  mode: UpsertMode;
  data: Tag | null;
  onClose: () => void;
}
export default function UpsertTagModal({
  mode,
  isOpen: open,
  data,
  onClose,
}: UpsertTagModalProps) {
  const tModal = useTranslations("tags.upsertModal");
  const tCommon = useTranslations("common");
  const form = useForm<UpsertTagInput>({
    resolver: zodResolver(upsertTagSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const { mutateAsync: createTag, isPending: isCreating } =
    useCreateTagMutation();

  const { mutateAsync: updateTag, isPending: isUpdating } =
    useUpdateTagMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (mode === "edit" && data) {
      form.reset({
        name: data.name,
        slug: data.slug,
      });
    } else {
      form.reset({
        name: "",
        slug: "",
      });
    }
  }, [mode, data, form]);

  const onSubmit = async (values: UpsertTagInput) => {
    try {
      if (mode === "create") {
        // call create API
        await createTag(values);
      } else if (mode === "edit" && data) {
        // call update API
        await updateTag({ id: data.id, data: values });
      }

      onClose();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const nameValue = useWatch({
    control: form.control,
    name: "name",
  });

  useEffect(() => {
    if (mode === "create") {
      form.setValue("slug", toSlug(nameValue), {
        shouldDirty: true,
      });
    }
  }, [nameValue, mode, form]);

  const isChanged = form.formState.isDirty;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="items-center">
          <DialogTitle>
            {mode === "create" ? tModal("createTitle") : tModal("editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form
          id="form-rhf-update-profile"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-name">
                    {tModal("fields.name.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-name"
                    aria-invalid={fieldState.invalid}
                    placeholder={tModal("fields.name.placeholder")}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {tCommon("actions.close")}
            </Button>
          </DialogClose>
          <Button
            disabled={!isChanged || isLoading}
            type="submit"
            form="form-rhf-update-profile"
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
