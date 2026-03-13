"use client";

import { IconFirst, IconLast } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { urlUtils } from "@/shared/utils/url.utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface StoryPaginationProps {
  currentPage: number;
  totalPages: number;
}
export function HomepageStoryPagination({
  currentPage,
  totalPages,
}: StoryPaginationProps) {
  const getVisiblePages = ({
    currentPage,
    totalPages,
    maxVisible = 5,
  }: {
    currentPage: number;
    totalPages: number;
    maxVisible?: number;
  }): number[] => {
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // Điều chỉnh khi gần đầu
    if (currentPage <= half) {
      end = Math.min(totalPages, maxVisible);
    }

    // Điều chỉnh khi gần cuối
    if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages({
    currentPage: currentPage,
    totalPages,
  });

  const searchParams = useSearchParams();

  const createPageUrl = (page: number) =>
    `?${urlUtils.createQueryString(searchParams, "page", String(page))}`;

  return (
    <div className="flex items-center justify-center flex-wrap gap-2">
      <Button
        disabled={currentPage === 1}
        size={"icon"}
        variant={"outline"}
        className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
        asChild
      >
        <Link href={createPageUrl(1)}>
          <IconFirst size="sm" color="custom" />
        </Link>
      </Button>
      {visiblePages.map((page, index) => (
        <Link
          key={index}
          href={createPageUrl(page)}
          className={`size-9 rounded-md flex items-center justify-center ${
            page === currentPage
              ? "bg-primary-orange text-primary-orange-foreground border-primary-orange"
              : "hover:bg-muted hover:text-primary border border-muted rounded-md text-sm text-muted-foreground"
          }`}
        >
          {page}
        </Link>
      ))}
      <Button
        size={"icon"}
        variant={"outline"}
        className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
        // onClick={() => .setPage(totalPages)}
        disabled={currentPage === totalPages}
        asChild
      >
        <Link href={createPageUrl(totalPages)}>
          <IconLast size="sm" color="custom" />
        </Link>
      </Button>
    </div>
  );
}
