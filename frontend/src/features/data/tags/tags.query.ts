import { useQuery } from "@tanstack/react-query";
import { TagQueryInput } from "./tags.schema";
import { tagsService } from "./tags.service";

export const TAGS_QUERY_KEYS = {
  all: ["tags"],
  lists: () => [...TAGS_QUERY_KEYS.all, "list"],
  list: (params: { page?: number; limit?: number }) => [
    ...TAGS_QUERY_KEYS.lists(),
    params,
  ],
  allList: () => [...TAGS_QUERY_KEYS.all, "all"],
};

/**
 * Get all tags with pagination
 */
export const useTagsQuery = (params?: TagQueryInput) => {
  return useQuery({
    queryKey: TAGS_QUERY_KEYS.list(params || {}),
    queryFn: () => tagsService.query(params),
  });
};

/**
 * Get all tags (no pagination)
 */
export const useAllTagsQuery = () => {
  return useQuery({
    queryKey: TAGS_QUERY_KEYS.allList(),
    queryFn: () => tagsService.findAll(),
  });
};
