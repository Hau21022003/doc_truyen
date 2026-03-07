import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChapterStatus } from "./chapter.constants";
import { CHAPTERS_QUERY_KEYS } from "./chapter.query";
import { chaptersService } from "./chapter.service";

/**
 * CREATE CHAPTER
 */
export const useCreateChapterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chaptersService.create,

    onSuccess: (data) => {
      const resultData = data.payload;

      // Invalidate chapters list to refetch
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // Invalidate story chapters if we have a storyId
      if (resultData.storyId) {
        queryClient.invalidateQueries({
          queryKey: CHAPTERS_QUERY_KEYS.storyChapters(resultData.storyId),
        });
      }
    },
  });
};

/**
 * UPDATE CHAPTER
 */
export const useUpdateChapterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      chaptersService.update(id, data),

    onSuccess: (data) => {
      const resultData = data.payload;
      // Invalidate chapters list to refetch
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // Invalidate specific chapter detail
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.detail(resultData.id),
      });

      // Invalidate story chapters if we have a storyId
      if (resultData.storyId) {
        queryClient.invalidateQueries({
          queryKey: CHAPTERS_QUERY_KEYS.storyChapters(resultData.storyId),
        });
      }
    },
  });
};

/**
 * UPDATE CHAPTER STATUS
 */
export const useUpdateChapterStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ChapterStatus }) =>
      chaptersService.updateStatus(id, status),

    onSuccess: (data) => {
      // Invalidate chapters list to refetch
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // Invalidate specific chapter detail
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.detail(data.payload.id),
      });

      // Invalidate story chapters if we have a storyId
      if (data.payload.storyId) {
        queryClient.invalidateQueries({
          queryKey: CHAPTERS_QUERY_KEYS.storyChapters(data.payload.storyId),
        });
      }
    },
  });
};

/**
 * DELETE CHAPTER
 */
export const useDeleteChapterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, storyId }: { id: number; storyId?: number }) =>
      chaptersService.remove(id),

    onSuccess: (_, { id, storyId }) => {
      // Invalidate chapters list to refetch
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // Invalidate specific chapter detail
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.detail(id),
      });

      // Invalidate story chapters if we have a storyId
      if (storyId) {
        queryClient.invalidateQueries({
          queryKey: CHAPTERS_QUERY_KEYS.storyChapters(storyId),
        });
      }
    },
  });
};

/**
 * DELETE MANY CHAPTERS
 */
export const useDeleteManyChaptersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, storyId }: { ids: number[]; storyId?: number }) =>
      chaptersService.removeMany(ids),

    onSuccess: (_, { storyId }) => {
      // Invalidate chapters list to refetch
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // Invalidate story chapters if we have a storyId
      if (storyId) {
        queryClient.invalidateQueries({
          queryKey: CHAPTERS_QUERY_KEYS.storyChapters(storyId),
        });
      }
    },
  });
};
