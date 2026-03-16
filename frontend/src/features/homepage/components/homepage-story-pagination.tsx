"use client";

import { IconFirst, IconLast } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getPaginationPages } from "@/shared/utils/pagination.utils";
import Link from "next/link";
import { useHomepageFilters } from "../hooks/use-homepage-filters";

interface StoryPaginationProps {
  currentPage: number;
  totalPages: number;
}
export function HomepageStoryPagination({
  currentPage,
  totalPages,
}: StoryPaginationProps) {
  const pages = getPaginationPages(currentPage, totalPages);

  const { createPageUrl } = useHomepageFilters();

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
      {pages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="text-muted-foreground">
            ...
          </span>
        ) : (
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
        ),
      )}
      <Button
        size={"icon"}
        variant={"outline"}
        className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
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
