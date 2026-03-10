import { useQuery } from "@tanstack/react-query";
import { StoryQueryInput } from "./story.schema";
import { storiesService } from "./story.service";

export const STORY_QUERY_KEYS = {
  all: ["stories"],
  lists: () => [...STORY_QUERY_KEYS.all, "list"],
  list: (params: StoryQueryInput) => [...STORY_QUERY_KEYS.lists(), params],
  details: () => [...STORY_QUERY_KEYS.all, "detail"],
  detail: (id?: number) => [...STORY_QUERY_KEYS.details(), id],
};

/**
 * Get all stories with pagination and filters
 */
export const useStoriesQuery = (params?: StoryQueryInput) => {
  return useQuery({
    queryKey: STORY_QUERY_KEYS.list(params || {}),
    queryFn: () => storiesService.findAll(params),
  });
};

/**
 * Get a specific story by ID
 */
export const useStoryQuery = (id?: number) => {
  return useQuery({
    queryKey: STORY_QUERY_KEYS.detail(id),
    queryFn: () => storiesService.findOne(id!),
    enabled: !!id,
  });
};
