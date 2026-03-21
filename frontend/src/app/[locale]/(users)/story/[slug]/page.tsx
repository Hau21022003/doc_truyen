import { storyService } from "@/features/data/story/story.service";
import {
  StoryDetailsContent,
  StoryDetailsHeader,
} from "@/features/views/story-details/components";
import { StoryDetailsInfo } from "@/features/views/story-details/components/story-details-info";
import { getErrorMessage } from "@/lib/error";
import { SortDirection } from "@/shared/constants";
import { getTranslations } from "next-intl/server";

// export async function generateMetadata({
//   params,
// }: StoryDetailsPageProps): Promise<Metadata> {
//   const { slug } = await params;

//   try {
//     const story = await storyService
//       .findBySlug(slug)
//       .then((res) => res.payload);

//     if (!story) {
//       return {
//         title: "Story not found",
//       };
//     }

//     return {
//       title: story.title,
//       description: story.description || story.title,
//       openGraph: {
//         title: story.title,
//         description: story.description,
//         images: [story.coverImage || ""],
//       },
//     };
//   } catch {
//     return {
//       title: "Error",
//     };
//   }
// }

type StoryDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    chapterSort?: SortDirection;
  }>;
};

export default async function StoryDetailsPage({
  params,
  searchParams,
}: StoryDetailsPageProps) {
  const { slug } = await params;
  const { chapterSort } = await searchParams;

  const t = await getTranslations();

  let fetchError;
  const story = await storyService
    .findBySlug(slug, chapterSort)
    .then((res) => res.payload)
    .catch((e) => {
      fetchError = e;
      return null;
    });

  if (fetchError || !story) {
    return (
      <div className="p-4 text-center text-red-500">
        {getErrorMessage(fetchError) || t("common.notification.fetchError")}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-6xl py-4">
        <StoryDetailsHeader story={story} />
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-7 lg:gap-14 items-start">
          <StoryDetailsInfo story={story} />
          <StoryDetailsContent story={story} />
        </div>
      </div>
    </div>
  );
}
