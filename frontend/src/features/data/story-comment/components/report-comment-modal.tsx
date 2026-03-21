"use client";

import { IconLoading } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleErrorApi } from "@/lib/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { COMMENT_REPORT_REASON_VALUES } from "../story-comment.constants";
import { useReportStoryCommentMutation } from "../story-comment.mutation";
import {
  ReportCommentInput,
  reportCommentSchema,
} from "../story-comment.schema";

interface ReportCommentModalProps {
  isOpen: boolean;
  commentId: number | null;
  onClose: () => void;
}

export function ReportCommentModal({
  isOpen,
  commentId,
  onClose,
}: ReportCommentModalProps) {
  const tComment = useTranslations("comment");
  const tModal = useTranslations("comment.report");
  const tCommon = useTranslations("common");

  const { mutateAsync: reportComment, isPending } =
    useReportStoryCommentMutation();

  const form = useForm<ReportCommentInput>({
    resolver: zodResolver(reportCommentSchema),
    defaultValues: {
      reason: undefined,
      description: "",
    },
  });

  const onSubmit = async (values: ReportCommentInput) => {
    if (!commentId) {
      toast.error("Comment ID không hợp lệ");
      return;
    }

    try {
      await reportComment({
        commentId,
        data: values,
      });
      form.reset();
      onClose();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="items-center">
          <DialogTitle>{tModal("createReportComment")}</DialogTitle>
        </DialogHeader>

        <form id="form-report-comment" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Reason Select */}
            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="report-reason">
                    {tModal("fields.reason.label")}
                  </FieldLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="report-reason">
                      <SelectValue
                        placeholder={tModal("fields.reason.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMENT_REPORT_REASON_VALUES.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {tComment(`reportReason.${reason}`)}
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

            {/* Description Textarea */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="report-description">
                    {tModal("fields.description.label")}
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id="report-description"
                    placeholder={tModal("fields.description.placeholder")}
                    className="resize-none max-h-24 overflow-y-auto"
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
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            {tCommon("actions.cancel")}
          </Button>
          <Button type="submit" form="form-report-comment" disabled={isPending}>
            {isPending && <IconLoading className="animate-spin" size="sm" />}
            {tModal("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
