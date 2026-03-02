import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAGS_QUERY_KEYS } from "./tags.query";
import { tagsService } from "./tags.service";

/**
 * CREATE TAG
 */
export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagsService.create,

    onSuccess: () => {
      // Invalidate tags list to refetch
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * UPDATE TAG
 */
export const useUpdateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      tagsService.update(id, data),

    onSuccess: (_, { id }) => {
      // Invalidate specific tag and tags list
      // queryClient.invalidateQueries({
      //   queryKey: TAGS_QUERY_KEYS.detail(id),
      // });
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * DELETE TAG
 */
export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagsService.remove,

    onSuccess: (_, id) => {
      // Remove specific tag from cache
      // queryClient.removeQueries({
      //   queryKey: TAGS_QUERY_KEYS.detail(id),
      // });

      // Invalidate tags list
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.lists(),
      });
    },
  });
};
