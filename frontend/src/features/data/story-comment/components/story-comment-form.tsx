"use client";

import CustomButton from "@/components/custom-button";
import { IconUserOutline } from "@/components/icons";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/shared/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateStoryCommentMutation } from "../story-comment.mutation";
import {
  CreateStoryCommentInput,
  createStoryCommentSchema,
} from "../story-comment.schema";

export default function StoryCommentForm({
  storyId,
  chapterId,
}: {
  storyId: number;
  chapterId?: number;
}) {
  const tComment = useTranslations("comment");
  const { isAuthenticated, isInitialized } = useAuthStore();
  const form = useForm<CreateStoryCommentInput>({
    resolver: zodResolver(createStoryCommentSchema),
    defaultValues: { storyId, chapterId, content: "", guestName: undefined },
  });
  const { mutateAsync: createComment } = useCreateStoryCommentMutation();

  useEffect(() => {
    form.reset({ storyId, chapterId, content: "", guestName: undefined });
  }, [storyId, chapterId]);

  const onSubmit = async (values: CreateStoryCommentInput) => {
    await toast.promise(createComment(values), {
      loading: tComment("creating"),
      success: () => {
        form.reset();
        return tComment("createSuccess");
      },
      error: (err) => getErrorMessage(err) || tComment("createFailed"),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{tComment("title")}</p>

      <form id="form-rhf-update-profile" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-5">
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  id="form-rhf-content"
                  aria-invalid={fieldState.invalid}
                  placeholder={tComment("fields.content.placeholder")}
                  autoComplete="off"
                  className="resize-none min-h-30 max-h-40 md:max-h-50 overflow-y-auto"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {isInitialized && !isAuthenticated && (
            <Controller
              name="guestName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-rhf-guestName"
                      aria-invalid={fieldState.invalid}
                      placeholder={tComment("fields.guestName.placeholder")}
                      autoComplete="off"
                    />
                    <InputGroupAddon>
                      <IconUserOutline />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <div className="flex justify-end">
            <CustomButton
              color="orange"
              size="default"
              className="rounded-full"
            >
              {tComment("create")}
            </CustomButton>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
