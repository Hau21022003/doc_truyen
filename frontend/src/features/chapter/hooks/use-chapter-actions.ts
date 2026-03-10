import { getErrorMessage } from "@/lib/error";
import { useConfirm } from "@/providers/confirm-provider";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useDeleteChapterMutation,
  useDeleteManyChaptersMutation,
} from "../chapter.mutation";
import { Chapter } from "../chapter.types";

export function useChapterActions() {
  const { confirm } = useConfirm();
  const tCommon = useTranslations("common");

  const { mutateAsync: deleteOne } = useDeleteChapterMutation();
  const { mutateAsync: deleteMany } = useDeleteManyChaptersMutation();

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

  return { removeOne, removeMany };
}
