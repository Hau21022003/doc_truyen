import { getErrorMessage } from "@/lib/error";
import { useConfirm } from "@/providers/confirm-provider";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useDeleteCommentMutation,
  useDeleteMultipleCommentsMutation,
} from "../story-comment.mutation";
import { AdminStoryComment } from "../story-comment.types";

export const useCommentActions = () => {
  const { confirm } = useConfirm();
  const tCommon = useTranslations("common");
  const tComment = useTranslations("comment");

  const { mutateAsync: deleteComment } = useDeleteCommentMutation();
  const { mutateAsync: deleteManyComments } =
    useDeleteMultipleCommentsMutation();

  const removeOne = async (comment: AdminStoryComment) => {
    const confirmed = await confirm({
      title: tCommon("actions.delete"),
      description: tCommon("delete.singleConfirm", {
        itemName: stringUtils.truncate(comment.content, 50),
      }),
      variant: "destructive",
    });

    if (!confirmed) return false;

    await toast.promise(deleteComment(comment.id), {
      loading: tCommon("actions.deleting"),
      success: () => tComment("delete.singleSuccess"),
      error: (err) => getErrorMessage(err) || tComment("delete.singleFailed"),
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

    await toast.promise(deleteManyComments(ids), {
      loading: tCommon("actions.deleting"),
      success: () => tComment("delete.multipleSuccess", { count: ids.length }),
      error: (err) => getErrorMessage(err) || tComment("delete.multipleFailed"),
    });

    return true;
  };

  return { removeOne, removeMany };
};
