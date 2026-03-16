export type PaginationItem = number | "...";

export function getPaginationPages(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  const pages: PaginationItem[] = [];

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => i + 1,
    );

    pages.push(...leftRange, "...", totalPages);
  } else if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + 1 + i,
    );

    pages.push(1, "...", ...rightRange);
  } else if (showLeftDots && showRightDots) {
    const middleRange = Array.from(
      { length: siblingCount * 2 + 1 },
      (_, i) => leftSibling + i,
    );

    pages.push(1, "...", ...middleRange, "...", totalPages);
  } else {
    pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
  }

  return pages;
}
