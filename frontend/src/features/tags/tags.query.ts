import { useQuery } from "@tanstack/react-query";
import { tagsService } from "./tags.service";

export const TAGS_QUERY_KEYS = {
  all: ["tags"],
  lists: () => [...TAGS_QUERY_KEYS.all, "list"],
  list: (params: { page?: number; limit?: number }) => [
    ...TAGS_QUERY_KEYS.lists(),
    params,
  ],
  details: () => [...TAGS_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...TAGS_QUERY_KEYS.details(), id],
};

/**
 * Get all tags with pagination
 */
export const useTagsQuery = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: TAGS_QUERY_KEYS.list(params || {}),
    queryFn: () => tagsService.findAll(params),
  });
};

/**
 * Get a specific tag by ID
 */
export const useTagQuery = (id: number) => {
  return useQuery({
    queryKey: TAGS_QUERY_KEYS.detail(id),
    queryFn: () => tagsService.findOne(id),
    enabled: !!id,
  });
};
