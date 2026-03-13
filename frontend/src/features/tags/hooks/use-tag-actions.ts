import { getErrorMessage } from "@/lib/error";
import { useConfirm } from "@/providers/confirm-provider";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useDeleteManyTagMutation,
  useDeleteTagMutation,
  useSetFeaturedTagMutation,
} from "../tags.mutation";
import { Tag } from "../tags.types";

export const useTagActions = () => {
  const { confirm } = useConfirm();
  const tCommon = useTranslations("common");

  const { mutateAsync: deleteTag } = useDeleteTagMutation();
  const { mutateAsync: deleteManyTags } = useDeleteManyTagMutation();
  const { mutateAsync: setFeatured } = useSetFeaturedTagMutation();

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

  return { removeOne, removeMany, toggleFeatured };
};
