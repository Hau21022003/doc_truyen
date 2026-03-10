import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChapterStatus } from "./chapter.constants";
import { CHAPTERS_QUERY_KEYS } from "./chapter.query";
import { UpsertChapterInput } from "./chapter.schema";
import { chaptersService } from "./chapter.service";

/**
 * CREATE CHAPTER
 */
export const useCreateChapterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chaptersService.create,

    onSuccess: (_, variables) => {
      const { storyId } = variables;

      // invalidate list
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // invalidate story chapters
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.storyChapters(storyId),
      });
    },
  });
};

/**
 * UPDATE CHAPTER
 */
export const useUpdateChapterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpsertChapterInput }) =>
      chaptersService.update(id, data),

    onSuccess: (_, variables) => {
      const {
        id,
        data: { storyId },
      } = variables;

      // invalidate list
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // invalidate chapter detail
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.detail(id),
      });

      // invalidate story chapters
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.storyChapters(storyId),
      });
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
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.story(),
      });
    },
  });
};

/**
 * DELETE CHAPTER
 */
export const useDeleteChapterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => chaptersService.remove(id),

    onSuccess: (_, id) => {
      // Invalidate chapters list to refetch
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // Invalidate specific chapter detail
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.detail(id),
      });

      // Invalidate story chapters if we have a storyId
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.story(),
      });
    },
  });
};

/**
 * DELETE MANY CHAPTERS
 */
export const useDeleteManyChaptersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => chaptersService.removeMany(ids),

    onSuccess: (_, ids) => {
      // Invalidate chapters list to refetch
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.lists(),
      });

      // Invalidate story chapters if we have a storyId
      queryClient.invalidateQueries({
        queryKey: CHAPTERS_QUERY_KEYS.story(),
      });
    },
  });
};
