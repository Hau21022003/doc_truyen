import { getErrorMessage } from "@/lib/error";
import { useConfirm } from "@/providers/confirm-provider";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { User } from "../../users/user.types";
import {
  useDeleteManyUsersMutation,
  useDeleteUserMutation,
} from "../../users/users.mutation";

export const useUsersActions = () => {
  const { confirm } = useConfirm();
  const tCommon = useTranslations("common");

  const { mutateAsync: deleteUser } = useDeleteUserMutation();
  const { mutateAsync: deleteManyUsers } = useDeleteManyUsersMutation();

  const removeOne = async (user: User) => {
    const confirmed = await confirm({
      title: tCommon("actions.delete"),
      description: tCommon("delete.singleConfirm", {
        itemName: stringUtils.truncate(user.name),
      }),
      variant: "destructive",
    });

    if (!confirmed) return false;

    await toast.promise(deleteUser(user.id), {
      loading: tCommon("actions.deleting"),
      success: () => tCommon("delete.singleSuccess", { itemName: user.name }),
      error: (err) => getErrorMessage(err) || tCommon("delete.singleFailed"),
    });

    return true;
  };

  const removeMany = async (ids: string[]) => {
    const confirmed = await confirm({
      title: tCommon("delete.multiple"),
      description: tCommon("delete.multipleConfirm", {
        count: ids.length,
      }),
      variant: "destructive",
    });

    if (!confirmed) return false;

    await toast.promise(deleteManyUsers(ids), {
      loading: tCommon("actions.deleting"),
      success: () => tCommon("delete.multipleSuccess", { count: ids.length }),
      error: (err) => getErrorMessage(err) || tCommon("delete.multipleFailed"),
    });

    return true;
  };

  return { removeOne, removeMany };
};
