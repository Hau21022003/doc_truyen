import { EmptyData } from "@/components/empty-data";
import { storyService } from "@/features/data/story/story.service";
import {
  HomepageMobileTagsFilter,
  HomepageStoryGrid,
  HomepageStoryPagination,
  HomepageTagsFilter,
} from "@/features/views/homepage/components";
import { HomepageTopStories } from "@/features/views/homepage/components/homepage-top-srories";
import { getErrorMessage } from "@/lib/error";
import { getTranslations } from "next-intl/server";

type HomePageProps = {
  searchParams: Promise<{
    tag?: string | string[];
    q?: string;
    page?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const t = await getTranslations();

  const params = await searchParams;

  const tags = Array.isArray(params.tag)
    ? params.tag
    : params.tag
      ? [params.tag]
      : [];

  const search = params.q ?? undefined;
  const page = params.page;

  let storiesData;
  try {
    storiesData = (
      await storyService.findHomepage({
        tags,
        search,
        page: Number(page) || 1,
      })
    ).payload;
  } catch (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {getErrorMessage(error) || t("common.notification.fetchError")}
      </div>
    );
  }

  const stories = storiesData.data;

  const hotStories = await storyService
    .findHotStories(10)
    .then((res) => res.payload?.data ?? [])
    .catch(() => []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-6xl py-4">
        <HomepageTopStories topStories={hotStories} />
        <HomepageMobileTagsFilter className="lg:hidden mb-7" />
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] items-start">
          {stories.length === 0 ? (
            <EmptyData size="md" />
          ) : (
            <div>
              <HomepageStoryGrid stories={stories} />
              <HomepageStoryPagination
                currentPage={storiesData.page}
                totalPages={storiesData.totalPages}
              />
            </div>
          )}
          <HomepageTagsFilter className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
