"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function useHomepageFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());

  const tags = params.getAll("tag");
  const page = Number(params.get("page") ?? "1");

  const toggleTag = (slug: string) => {
    const newParams = new URLSearchParams(params.toString());
    const currentTags = newParams.getAll("tag");

    if (currentTags.includes(slug)) {
      const filtered = currentTags.filter((t) => t !== slug);
      newParams.delete("tag");
      filtered.forEach((t) => newParams.append("tag", t));
    } else {
      newParams.append("tag", slug);
    }

    // reset page khi filter
    newParams.set("page", "1");

    router.push(`?${newParams.toString()}`);
  };

  const setPage = (newPage: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", String(newPage));
    router.push(`?${newParams.toString()}`);
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  return {
    tags,
    page,
    toggleTag,
    setPage,
    createPageUrl,
  };
}
