import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BOOKMARK_QUERY_KEYS } from "./bookmark.query";
import { CreateBookmarkInput } from "./bookmark.schema";
import { bookmarkService } from "./bookmark.service";

/**
 * CREATE BOOKMARK
 */
export const useCreateBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookmarkInput) => bookmarkService.create(data),

    onSuccess: () => {
      // Invalidate bookmarks list to refetch
      queryClient.invalidateQueries({
        queryKey: BOOKMARK_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * DELETE BOOKMARK
 */
export const useDeleteBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storyId: number) => bookmarkService.remove(storyId),

    onSuccess: () => {
      // Invalidate bookmarks list to refetch
      queryClient.invalidateQueries({
        queryKey: BOOKMARK_QUERY_KEYS.lists(),
      });
    },
  });
};
