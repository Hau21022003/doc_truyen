import { IconDeleteOutline } from "@/components/icons";
import { imageUtils } from "@/shared/utils/image.utils";
import Link from "next/link";
import { Bookmark } from "../bookmark.types";

export function BookmarkItem({
  bookmark,
  onDelete,
}: {
  bookmark: Bookmark;
  onDelete: (bookmark: Bookmark) => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-muted dark:bg-muted-foreground/20 flex items-start gap-4">
      <img
        src={imageUtils.optimizeCloudinary(bookmark.story.coverImage || "", {
          width: 80,
          height: 80,
        })}
        alt=""
        className="w-20 h-20"
      />
      <div className="flex-1 space-y-1">
        <Link
          href={`/story/${bookmark.story.slug}`}
          className="line-clamp-2 max-w-2xs font-medium"
        >
          {bookmark.story.title}
        </Link>
        {bookmark.lastReadChapter?.chapterNumber && (
          <Link
            href={`/story/${bookmark.story.slug}/chapter-${bookmark.lastReadChapter?.chapterNumber}`}
            className="hover:underline underline-offset-4 text-primary-orange"
          >{`Chap ${bookmark.lastReadChapter.chapterNumber}`}</Link>
        )}
      </div>
      <button
        className="[&_svg:not([class*='size-'])]:size-7 cursor-pointer"
        onClick={() => onDelete(bookmark)}
      >
        <IconDeleteOutline color="custom" className="text-destructive" />
      </button>
    </div>
  );
}
