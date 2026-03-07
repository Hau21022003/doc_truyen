import { useQuery } from "@tanstack/react-query";
import { ChapterQueryInput } from "./chapter.schema";
import { chaptersService } from "./chapter.service";

export const CHAPTERS_QUERY_KEYS = {
  all: ["chapters"],
  lists: () => [...CHAPTERS_QUERY_KEYS.all, "list"],
  list: (params: { page?: number; limit?: number }) => [
    ...CHAPTERS_QUERY_KEYS.lists(),
    params,
  ],
  detail: (id: number) => [...CHAPTERS_QUERY_KEYS.all, "detail", id],
  storyChapters: (storyId: number) => [
    ...CHAPTERS_QUERY_KEYS.all,
    "story",
    storyId,
  ],
};

/**
 * Get all chapters with pagination
 */
export const useChaptersQuery = (params?: ChapterQueryInput) => {
  return useQuery({
    queryKey: CHAPTERS_QUERY_KEYS.list(params || {}),
    queryFn: () => chaptersService.query(params),
  });
};

/**
 * Get chapter by ID
 */
export const useChapterQuery = (id: number, includeContent = false) => {
  return useQuery({
    queryKey: [...CHAPTERS_QUERY_KEYS.detail(id), { includeContent }],
    queryFn: () => chaptersService.getById(id, includeContent),
    enabled: !!id,
  });
};

/**
 * Get chapters by story ID
 */
export const useStoryChaptersQuery = (
  storyId: number,
  includeContent = false,
) => {
  return useQuery({
    queryKey: [
      ...CHAPTERS_QUERY_KEYS.storyChapters(storyId),
      { includeContent },
    ],
    queryFn: () => chaptersService.getByStoryId(storyId, includeContent),
    enabled: !!storyId,
  });
};
