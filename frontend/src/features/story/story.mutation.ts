import { useMutation, useQueryClient } from "@tanstack/react-query";
import { STORY_QUERY_KEYS } from "./story.query";
import { storiesService } from "./story.service";

/**
 * CREATE STORY
 */
export const useCreateStoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storiesService.create,

    onSuccess: () => {
      // Invalidate stories list to refetch
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * UPDATE STORY
 */
export const useUpdateStoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      storiesService.update(id, data),

    onSuccess: (_, { id }) => {
      // Invalidate both lists and the specific story
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.detail(id),
      });
    },
  });
};

/**
 * DELETE STORY
 */
export const useDeleteStoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storiesService.remove,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * DELETE MANY STORIES
 */
export const useDeleteManyStoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storiesService.removeMany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.lists(),
      });
    },
  });
};
