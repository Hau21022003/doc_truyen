import { useRouter } from "@/i18n/navigation";
import { SortDirection } from "@/shared/constants";
import { useSearchParams } from "next/navigation";

export function useChapterSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSort = searchParams.get("chapterSort");

  const chapterSort: SortDirection =
    rawSort === "ASC" || rawSort === "DESC" ? rawSort : "DESC";

  const setChapterSort = (chapterSort: SortDirection) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("chapterSort", chapterSort);

    router.push(`?${params.toString()}`);
  };

  const toggleChapterSort = () => {
    const nextSort = chapterSort === "ASC" ? "DESC" : "ASC";

    setChapterSort(nextSort);
  };

  return { chapterSort, toggleChapterSort };
}
