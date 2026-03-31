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
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.allList(),
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
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.allList(),
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
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.allList(),
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
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.allList(),
      });
    },
  });
};

/**
 * SET TAG FEATURED
 */
export const useSetFeaturedTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: number; isFeatured: boolean }) =>
      tagsService.setFeatured(id, isFeatured),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.allList(),
      });
    },
  });
};

/**
 * IMPORT TAGS FROM EXCEL
 */
export const useImportTagsExcelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => tagsService.importExcel(file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: TAGS_QUERY_KEYS.allList(),
      });
    },
  });
};

/**
 * EXPORT TAGS TO EXCEL
 */
export const useExportTagsExcelMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const blob = (await tagsService.exportExcel()).payload;
      if (blob && blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tags-${Date.now()}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
  });
};
