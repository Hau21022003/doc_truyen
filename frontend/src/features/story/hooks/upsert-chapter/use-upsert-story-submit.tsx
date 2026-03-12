import { useRouter } from "@/i18n/navigation";
import { handleErrorApi } from "@/lib/error";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useCreateStoryMutation,
  useUpdateStoryMutation,
} from "../../story.mutation";
import { UpsertStoryInput } from "../../story.schema";

export const useUpsertStorySubmit = () => {
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { mutateAsync: createStory, isPending: isCreating } =
    useCreateStoryMutation();
  const { mutateAsync: updateStory, isPending: isUpdating } =
    useUpdateStoryMutation();

  const onSubmit = async (values: UpsertStoryInput, storyId?: number) => {
    try {
      if (storyId) {
        await updateStory({ id: storyId, data: values });
        toast.success(tCommon("actions.updateSuccess"), { duration: 3000 });
      } else {
        await createStory(values);
        router.push(`/admin/story`);
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
