import StoryGrid from "@/features/story/components/story-grid";
import { storyService } from "@/features/story/story.service";
import { getErrorMessage } from "@/lib/error";
import { getTranslations } from "next-intl/server";

type PageProps = {
  searchParams: Promise<{
    tag?: string | string[];
    q?: string;
    page?: string;
  }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const t = await getTranslations("homePage");
  const tCommon = await getTranslations("homePage");

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
        {getErrorMessage(error) || t("fetchError")}
      </div>
    );
  }

  console.log("storiesData", storiesData);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr]">
          <StoryGrid stories={storiesData.data} />
          {/* <TagFilter className="" /> */}
        </div>
      </div>
    </div>
  );
}
