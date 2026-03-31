import { getErrorMessage } from "@/lib/error";
import { useConfirm } from "@/providers/confirm-provider";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useDeleteManyStoryMutation,
  useDeleteStoryMutation,
  useExportStoryExcelMutation,
  useImportStoryExcelMutation,
} from "../story.mutation";
import { Story } from "../story.types";

export const useStoryActions = () => {
  const { confirm } = useConfirm();
  const tCommon = useTranslations("common");

  const { mutateAsync: deleteStory } = useDeleteStoryMutation();
  const { mutateAsync: deleteManyStories } = useDeleteManyStoryMutation();
  const { mutateAsync: exportExcel } = useExportStoryExcelMutation();
  const { mutateAsync: importExcel } = useImportStoryExcelMutation();

  const removeOne = async (tag: Story) => {
    const confirmed = await confirm({
      title: tCommon("actions.delete"),
      description: tCommon("delete.singleConfirm", {
        itemName: stringUtils.truncate(tag.title),
      }),
      variant: "destructive",
    });

    if (!confirmed) return false;

    await toast.promise(deleteStory(tag.id), {
      loading: tCommon("actions.deleting"),
      success: () => tCommon("delete.singleSuccess", { itemName: tag.title }),
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

    await toast.promise(deleteManyStories(ids), {
      loading: tCommon("actions.deleting"),
      success: () => tCommon("delete.multipleSuccess", { count: ids.length }),
      error: (err) => getErrorMessage(err) || tCommon("delete.multipleFailed"),
    });

    return true;
  };

  const handleExportExcel = async () => {
    await toast.promise(exportExcel(), {
      loading: tCommon("actions.exporting"),
      success: () => tCommon("actions.exportSuccess"),
      error: (err) => getErrorMessage(err) || tCommon("actions.exportFailed"),
    });
  };

  const handleImportExcel = async (file: File) => {
    await toast.promise(importExcel(file), {
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
};
