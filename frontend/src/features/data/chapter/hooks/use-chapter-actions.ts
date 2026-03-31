import { getErrorMessage } from "@/lib/error";
import { useConfirm } from "@/providers/confirm-provider";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Story } from "../../story/story.types";
import {
  useDeleteChapterMutation,
  useDeleteManyChaptersMutation,
  useExportChaptersExcelMutation,
  useImportChaptersExcelMutation,
} from "../chapter.mutation";
import { Chapter } from "../chapter.types";

export function useChapterActions() {
  const { confirm } = useConfirm();
  const tCommon = useTranslations("common");

  const { mutateAsync: deleteOne } = useDeleteChapterMutation();
  const { mutateAsync: deleteMany } = useDeleteManyChaptersMutation();
  const { mutateAsync: exportExcel } = useExportChaptersExcelMutation();
  const { mutateAsync: importExcel } = useImportChaptersExcelMutation();

  const removeOne = async (chapter: Chapter) => {
    const confirmed = await confirm({
      title: tCommon("actions.delete"),
      description: tCommon("delete.singleConfirm", {
        itemName: stringUtils.truncate(chapter.title),
      }),
      variant: "destructive",
    });

    if (!confirmed) return false;

    await toast.promise(deleteOne(chapter.id), {
      loading: tCommon("actions.deleting"),
      success: () =>
        tCommon("delete.singleSuccess", { itemName: chapter.title }),
      error: (err) => getErrorMessage(err) || tCommon("delete.singleFailed"),
    });

    return true;
  };

  const removeMany = async (ids: number[]) => {
    const confirmed = await confirm({
      title: tCommon("delete.multiple"),
      description: tCommon("delete.multipleConfirm", {
        count: ids.length,
      }),
      variant: "destructive",
    });

    if (!confirmed) return false;

    await toast.promise(deleteMany(ids), {
      loading: tCommon("actions.deleting"),
      success: () => tCommon("delete.multipleSuccess", { count: ids.length }),
      error: (err) => getErrorMessage(err) || tCommon("delete.multipleFailed"),
    });

    return true;
  };

  const handleExportExcel = async (story: Story) => {
    await toast.promise(exportExcel(story), {
      loading: tCommon("actions.exporting"),
      success: () => tCommon("actions.exportSuccess"),
      error: (err) => getErrorMessage(err) || tCommon("actions.exportFailed"),
    });
  };

  const handleImportExcel = async (file: File, story: Story) => {
    await toast.promise(importExcel({ file, story }), {
      loading: tCommon("actions.importing"),
      success: ({ payload }) => {
        const { imported, errors } = payload;

        // Có lỗi → partial success
        if (errors.length) {
          const firstError = errors[0];

          return tCommon("actions.importPartialSuccess", {
            imported,
            errors: errors.length,
            errorDetail: `Row ${firstError.row}: ${firstError.messages.join(", ")}`,
          });
        }

        // Thành công hoàn toàn
        return tCommon("actions.importSuccessWithCount", {
          imported,
        });
      },
      error: (err) => getErrorMessage(err) || tCommon("actions.importFailed"),
    });
  };

  return { removeOne, removeMany, handleExportExcel, handleImportExcel };
}
