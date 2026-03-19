import { useAuthModal } from "@/features/data/auth/hooks/use-auth-modal.hook";
import { useCreateBookmarkMutation } from "@/features/data/bookmark/bookmark.mutation";
import { getErrorMessage } from "@/lib/error";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function useStoryDetailsActions() {
  const tCommon = useTranslations("common");
  const { requireAuth } = useAuthModal();

  const { mutateAsync: createBookmark } = useCreateBookmarkMutation();

  const addBookmark = (storyId: number) => {
    requireAuth(() => {
      toast.promise(createBookmark({ storyId }), {
        loading: tCommon("actions.create"),
        success: () => tCommon("actions.createSuccess"),
        error: (err) =>
          getErrorMessage(err) || tCommon("notification.fetchError"),
      });
    });
  };
  return { addBookmark };
}
