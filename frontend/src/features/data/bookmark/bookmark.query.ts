import { useQuery } from "@tanstack/react-query";
import { BookmarkQueryInput } from "./bookmark.schema";
import { bookmarkService } from "./bookmark.service";

export const BOOKMARK_QUERY_KEYS = {
  all: ["bookmarks"],
  lists: () => [...BOOKMARK_QUERY_KEYS.all, "list"],
  list: (params: { page?: number; limit?: number }) => [
    ...BOOKMARK_QUERY_KEYS.lists(),
    params,
  ],
};

/**
 * Get current user's bookmarks
 * Requires authentication
 */
export const useBookmarksQuery = (params: BookmarkQueryInput = {}) => {
  return useQuery({
    queryKey: BOOKMARK_QUERY_KEYS.list({
      page: params.page,
      limit: params.limit,
    }),
    queryFn: () => bookmarkService.getByUser(params),
  });
};
