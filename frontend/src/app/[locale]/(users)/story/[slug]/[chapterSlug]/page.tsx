import { chaptersService } from "@/features/data/chapter/chapter.service";
import {
  ChapterReadingComments,
  ChapterReadingContent,
  ChapterReadingHeader,
  ChapterReadingNavigator,
  ChapterReadingStickyNavigator,
} from "@/features/views/chapter-reading/components";
import { getErrorMessage } from "@/lib/error";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

type ChapterPageProps = {
  params: Promise<{
    chapterSlug: string;
    slug: string;
  }>;
};

export default async function ChapterPage({ params }: ChapterPageProps) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  // Params
  const { chapterSlug, slug: storySlug } = await params;

  const chapterNumber = (() => {
    const match = chapterSlug.match(/^chapter-(\d+)/);
    if (!match) return null;
    return Number(match[1]);
  })();

  const t = await getTranslations();

  if (!chapterNumber) {
    return (
      <div className="p-4 text-center text-red-500">
        {t("chapter.invalidChapter")}
      </div>
    );
  }

  let fetchError;
  const chapter = await chaptersService
    .getByStorySlugAndNumber(storySlug, chapterNumber, {
      headers: {
        Cookie: cookieHeader,
      },
    })
    .then((res) => res.payload)
    .catch((e) => {
      fetchError = e;
      return null;
    });

  if (fetchError || !chapter) {
    return (
      <div className="p-4 text-center text-red-500">
        {getErrorMessage(fetchError) || t("common.notification.fetchError")}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 relative">
      {/* Header with breadcrumb */}
      <ChapterReadingHeader chapter={chapter} />

      {/* Top navigation (cố định) */}
      <ChapterReadingNavigator
        chapter={chapter}
        currentChapterNumber={chapterNumber}
      />

      {/* Main content */}
      <ChapterReadingContent chapter={chapter} />

      {/* Bottom navigation */}
      <ChapterReadingNavigator
        chapter={chapter}
        currentChapterNumber={chapterNumber}
      />

      {/* Comments */}
      <ChapterReadingComments chapter={chapter} />

      {/* Sticky navigation - chỉ hiện khi scroll UP và chưa đến cuối */}
      <ChapterReadingStickyNavigator
        chapter={chapter}
        currentChapterNumber={chapterNumber}
        threshold={300} // Scroll xuống 300px mới bắt đầu hiện
      />
    </div>
  );
}
