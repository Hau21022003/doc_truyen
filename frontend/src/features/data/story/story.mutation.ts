import { downloadBlob } from "@/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { STORY_QUERY_KEYS } from "./story.query";
import { storyService } from "./story.service";

/**
 * CREATE STORY
 */
export const useCreateStoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storyService.create,

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
      storyService.update(id, data),

    onSuccess: (_, { id }) => {
      // Invalidate both lists and the specific story
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.slug(),
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
    mutationFn: storyService.remove,

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
    mutationFn: storyService.removeMany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * RATE STORY
 */
export const useRateStoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storyService.rate,

    onSuccess: (_, { storyId }) => {
      // Invalidate story detail để cập nhật averageRating, ratingCount
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.detail(storyId),
      });

      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.slug(),
      });

      // Invalidate story lists để cập nhật rating trong grid/list
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * IMPORT STORIES FROM EXCEL
 */
export const useImportStoryExcelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => storyService.importExcel(file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORY_QUERY_KEYS.all,
      });
    },
  });
};

/**
 * EXPORT STORIES TO EXCEL
 */
export const useExportStoryExcelMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const blob = (await storyService.exportExcel()).payload;
      if (blob instanceof Blob) {
        downloadBlob(blob, `stories-${Date.now()}.xlsx`);
      }
    },
  });
};
