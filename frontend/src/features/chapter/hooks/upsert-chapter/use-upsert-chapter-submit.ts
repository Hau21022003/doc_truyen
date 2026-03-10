import { useRouter } from "@/i18n/navigation";
import { handleErrorApi } from "@/lib/error";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useCreateChapterMutation,
  useUpdateChapterMutation,
} from "../../chapter.mutation";
import { UpsertChapterInput } from "../../chapter.schema";

export const useUpsertChapterSubmit = (storyId?: number) => {
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { mutateAsync: createChapter, isPending: isCreating } =
    useCreateChapterMutation();

  const { mutateAsync: updateChapter, isPending: isUpdating } =
    useUpdateChapterMutation();

  const onSubmit = async (values: UpsertChapterInput, chapterId?: number) => {
    try {
      if (chapterId) {
        await updateChapter({ id: chapterId, data: values });
        toast.success(tCommon("actions.updateSuccess"), { duration: 3000 });
      } else {
        await createChapter(values);
        router.push(`/admin/story/${storyId}/chapters`);
      }
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return {
    onSubmit,
    isPending: isCreating || isUpdating,
  };
};
