import { SortDirection } from "@/shared/constants";
import { useQuery } from "@tanstack/react-query";
import { StoryQueryInput } from "./story.schema";
import { storyService } from "./story.service";

export const STORY_QUERY_KEYS = {
  all: ["stories"],
  lists: () => [...STORY_QUERY_KEYS.all, "list"],
  list: (params: StoryQueryInput) => [...STORY_QUERY_KEYS.lists(), params],
  details: () => [...STORY_QUERY_KEYS.all, "detail"],
  detail: (id?: number) => [...STORY_QUERY_KEYS.details(), id],
  hot: () => [...STORY_QUERY_KEYS.all, "hot"],
  hotList: (limit?: number) => [...STORY_QUERY_KEYS.hot(), limit ?? 10],
  slug: () => [...STORY_QUERY_KEYS.all, "slug"],
  slugDetail: (slug: string, chapterSort?: SortDirection) => [
    ...STORY_QUERY_KEYS.slug(),
    slug,
    chapterSort ?? "default",
  ],
};

/**
 * Get all stories with pagination and filters
 */
export const useStoriesQuery = (params?: StoryQueryInput) => {
  return useQuery({
    queryKey: STORY_QUERY_KEYS.list(params || {}),
    queryFn: () => storyService.findAll(params),
  });
};

/**
 * Get a specific story by ID
 */
export const useStoryQuery = (id?: number) => {
  return useQuery({
    queryKey: STORY_QUERY_KEYS.detail(id),
    queryFn: () => storyService.findOne(id!),
    enabled: !!id,
  });
};

/**
 * Get hot stories with time decay
 */
export const useHotStoriesQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: STORY_QUERY_KEYS.hotList(limit),
    queryFn: () => storyService.findHotStories(limit),
    staleTime: 5 * 60 * 1000, // cache 5 phút
  });
};

/**
 * Get a specific story by slug
 */
export const useStoryBySlugQuery = (
  slug: string,
  chapterSort?: SortDirection,
) => {
  return useQuery({
    // queryKey: [...STORY_QUERY_KEYS.details(), "slug", slug, chapterSort],
    queryKey: STORY_QUERY_KEYS.slugDetail(slug, chapterSort),
    queryFn: () => storyService.findBySlug(slug!, chapterSort),
    enabled: !!slug,
  });
};
