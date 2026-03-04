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

    onSuccess: () => {
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
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * DELETE MANY TAG
 */
export const useDeleteManyTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagsService.removeMany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.lists(),
      });
    },
  });
};
