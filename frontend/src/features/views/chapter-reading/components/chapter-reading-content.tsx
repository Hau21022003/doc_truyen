import { ChapterWithContent } from "@/features/data/chapter/chapter.types";

export function ChapterReadingContent({
  chapter,
}: {
  chapter: ChapterWithContent;
}) {
  return (
    <div>
      {chapter.contents.map((content, idx) => {
        const prev = chapter.contents[idx - 1];

        const isImage = content.contentType === "image";
        const prevIsImage = prev?.contentType === "image";

        // 👉 chỉ add margin nếu KHÔNG phải image-image
        const shouldAddSpacing = !(isImage && prevIsImage);

        const className = shouldAddSpacing ? "mt-4" : "";

        if (isImage) {
          if (!content.imageUrl) return null;

          return (
            <img
              key={idx}
              src={content.imageUrl}
              alt={`Chapter image ${idx + 1}`}
              loading="lazy"
              decoding="async"
              className={`w-full ${className}`}
            />
          );
        }

        return (
          <div
            key={idx}
            className={`prose max-w-none ${className}`}
            dangerouslySetInnerHTML={{
              __html: content.textContent || "",
            }}
          />
        );
      })}

      {/* ✅ Marker: Đánh dấu hết chapter content */}
      <div data-chapter-content-end className="h-0" />
    </div>
  );
}
