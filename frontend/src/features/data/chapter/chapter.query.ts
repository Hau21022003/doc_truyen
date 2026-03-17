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
  detail: (id?: number) => [...CHAPTERS_QUERY_KEYS.all, "detail", id],

  read: (id?: number) => [...CHAPTERS_QUERY_KEYS.all, "read", id],

  story: () => [...CHAPTERS_QUERY_KEYS.all, "story"],

  storyChapters: (storyId?: number) => [
    ...CHAPTERS_QUERY_KEYS.story(),
    storyId,
  ],

  storyChaptersList: (storyId?: number, params?: ChapterQueryInput) => [
    ...CHAPTERS_QUERY_KEYS.storyChapters(storyId),
    params,
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
export const useChapterQuery = (id?: number) => {
  return useQuery({
    queryKey: [...CHAPTERS_QUERY_KEYS.detail(id)],
    queryFn: () => chaptersService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Get chapters by story ID
 */
export const useStoryChaptersQuery = ({
  params,
  storyId,
}: {
  storyId?: number;
  params: ChapterQueryInput;
}) => {
  return useQuery({
    queryKey: [...CHAPTERS_QUERY_KEYS.storyChaptersList(storyId, params)],
    queryFn: () => chaptersService.getByStoryId(storyId!, params),
    enabled: !!storyId,
  });
};

/**
 * Get chapter detail for user
 */
// export const useChapterDetailForUserQuery = (id?: number) => {
//   return useQuery({
//     queryKey: CHAPTERS_QUERY_KEYS.read(id),
//     queryFn: () => chaptersService.getChapterDetailForUser(id!),
//     enabled: !!id,
//   });
// };
