import CustomButton from "@/components/custom-button";
import { EmptyData } from "@/components/empty-data";
import {
  IconCommentOutline,
  IconCupFill,
  IconStarOutline,
  IconView,
} from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useHotStoriesQuery } from "@/features/data/story/story.query";
import { getErrorMessage } from "@/lib/error";
import { imageUtils } from "@/shared/utils/image.utils";
import { numberUtils } from "@/shared/utils/number.utils";
import { useTranslations } from "next-intl";

export function DashboardTopStories() {
  const tCommon = useTranslations("common");
  const tDashboard = useTranslations("dashboard");
  const { data, error, isLoading, refetch } = useHotStoriesQuery();
  const stories = data?.payload.data || [];

  return (
    <div className="p-4 rounded-xl bg-muted space-y-2">
      <div className="flex items-center gap-3">
        <IconCupFill size={"sm"} color="custom" className="text-yellow-500" />
        <p className="font-semibold text-base">{tDashboard("topStories")}</p>
      </div>

      <Separator />

      {!isLoading && stories.length === 0 && <EmptyData size="sm" />}

      {error && (
        <div className="flex flex-col items-center">
          <div className="p-4 text-center text-red-500">
            {getErrorMessage(error)}
          </div>
          <CustomButton color="orange" onClick={() => refetch()}>
            {tCommon("actions.retry")}
          </CustomButton>
        </div>
      )}

      <ul className="space-y-4 mt-4">
        {/* List story */}
        {stories.map((story) => (
          <li key={story.id} className="flex gap-4 items-start">
            <img
              src={imageUtils.optimizeCloudinary(story.coverImage || "", {
                height: 80,
                width: 80,
              })}
              alt=""
              className="w-14 h-14 shrink-0"
            />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium line-clamp-1">{story.title}</p>
              <div className="flex gap-4 flex-wrap items-center text-muted-foreground">
                <div className="flex gap-1 items-center shrink-0">
                  <IconView color="custom" size={"xs"} />
                  <p className="text-xs text-primary">
                    {numberUtils.formatCompactNumber(story.viewCount)}
                  </p>
                </div>

                <div className="flex gap-1 items-center shrink-0">
                  <IconCommentOutline color="custom" size={"xs"} />
                  <p className="text-xs text-primary">
                    {numberUtils.formatCompactNumber(story.commentCount)}
                  </p>
                </div>

                <div className="flex gap-1 items-center shrink-0">
                  <IconStarOutline color="custom" size={"sm"} />
                  <p className="text-xs text-primary">
                    {Math.round(story.averageRating * 10) / 10}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}

        {/* Loading */}
        {isLoading &&
          Array.from({ length: 5 }).map((i) => (
            <li key={`skeleton_${i}`}>
              <div className="flex gap-4 items-start animate-pulse">
                <Skeleton className="w-14 h-14 shrink-0 dark:bg-muted-foreground/50" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 max-w-32 w-full dark:bg-muted-foreground/50" />
                  <Skeleton className="h-4 w-3/4 dark:bg-muted-foreground/50" />
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
