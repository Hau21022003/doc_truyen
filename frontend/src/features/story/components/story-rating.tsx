"use client";
// Trong component React:
import { Rating } from "@/components/rating";
import { useAuthModal } from "@/features/auth/hooks/use-auth-modal.hook";
import { useRateStoryMutation } from "@/features/story/story.mutation";
import { useRouter } from "@/i18n/navigation";
import { getErrorMessage } from "@/lib/error";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Story } from "../story.types";

export default function StoryRating({ story }: { story: Story }) {
  const router = useRouter();
  const t = useTranslations("story");
  const { mutateAsync: rateStory, isPending } = useRateStoryMutation();
  const { requireAuth } = useAuthModal();

  const handleRate = (rating: number) =>
    requireAuth(async () => {
      await toast.promise(rateStory({ rating, storyId: story.id }), {
        loading: t("actions.rating"),
        success: () => t("actions.rateSuccess"),
        error: (err) => getErrorMessage(err) || t("actions.rateFailed"),
      });

      router.refresh();
    });

  return (
    <div>
      <Rating
        value={story.averageRating}
        readOnly={isPending}
        size="lg"
        showValue
        className=""
        onChange={handleRate}
      />
    </div>
  );
}
