import { getErrorMessage } from "@/lib/error";
import { useConfirm } from "@/providers/confirm-provider";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useDeleteManyTagMutation,
  useDeleteTagMutation,
  useExportTagsExcelMutation,
  useImportTagsExcelMutation,
  useSetFeaturedTagMutation,
} from "../tags.mutation";
import { Tag } from "../tags.types";

export const useTagActions = () => {
  const { confirm } = useConfirm();
  const tCommon = useTranslations("common");

  const { mutateAsync: deleteTag } = useDeleteTagMutation();
  const { mutateAsync: deleteManyTags } = useDeleteManyTagMutation();
  const { mutateAsync: setFeatured } = useSetFeaturedTagMutation();
  const { mutateAsync: exportExcel } = useExportTagsExcelMutation();
  const { mutateAsync: importExcel } = useImportTagsExcelMutation();

  const removeOne = async (tag: Tag) => {
    const confirmed = await confirm({
      title: tCommon("actions.delete"),
      description: tCommon("delete.singleConfirm", {
        itemName: stringUtils.truncate(tag.name),
      }),
      variant: "destructive",
    });

    if (!confirmed) return false;

    await toast.promise(deleteTag(tag.id), {
      loading: tCommon("actions.deleting"),
      success: () => tCommon("delete.singleSuccess", { itemName: tag.name }),
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

    await toast.promise(deleteManyTags(ids), {
      loading: tCommon("actions.deleting"),
      success: () => tCommon("delete.multipleSuccess", { count: ids.length }),
      error: (err) => getErrorMessage(err) || tCommon("delete.multipleFailed"),
    });

    return true;
  };

  const toggleFeatured = async (tag: Tag) => {
    await toast.promise(
      setFeatured({
        id: tag.id,
        isFeatured: !tag.isFeatured,
      }),
      {
        loading: tCommon("actions.updating"),
        success: () => tCommon("actions.updateSuccess"),
        error: (err) => getErrorMessage(err) || tCommon("actions.updateFailed"),
      },
    );
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

  return {
    removeOne,
    removeMany,
    toggleFeatured,
    handleExportExcel,
    handleImportExcel,
  };
};
