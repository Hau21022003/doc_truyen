import { useMutation, useQueryClient } from "@tanstack/react-query";
import { STORY_COMMENTS_QUERY_KEYS } from "./story-comment.query";
import {
  CreateStoryCommentInput,
  ReportCommentInput,
} from "./story-comment.schema";
import { storyCommentsService } from "./story-comment.service";

/**
 * CREATE STORY COMMENT
 */
export const useCreateStoryCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoryCommentInput) =>
      storyCommentsService.create(data),

    onSuccess: (_, variables) => {
      const { storyId } = variables;

      // Invalidate comments list for this story
      queryClient.invalidateQueries({
        queryKey: STORY_COMMENTS_QUERY_KEYS.list({
          storyId,
        }),
      });
    },
  });
};

/**
 * REPORT STORY COMMENT
 */
export const useReportStoryCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number;
      data: ReportCommentInput;
    }) => storyCommentsService.report(commentId, data),

    onSuccess: () => {
      // Optional: invalidate comments list to reflect flagCount change
      queryClient.invalidateQueries({
        queryKey: STORY_COMMENTS_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * DELETE SINGLE COMMENT
 */
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => storyCommentsService.delete(id),

    onSuccess: (response) => {
      // Invalidate admin comments list
      queryClient.invalidateQueries({
        queryKey: STORY_COMMENTS_QUERY_KEYS.queries(),
      });
    },
  });
};

/**
 * DELETE MULTIPLE COMMENTS
 */
export const useDeleteMultipleCommentsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => storyCommentsService.deleteMany(ids),

    onSuccess: (response) => {
      // Invalidate admin comments list
      queryClient.invalidateQueries({
        queryKey: STORY_COMMENTS_QUERY_KEYS.queries(),
      });
    },
  });
};
