import { useMutation, useQueryClient } from "@tanstack/react-query";
import { STORY_COMMENTS_QUERY_KEYS } from "./story-comment.query";
import { CreateStoryCommentInput } from "./story-comment.schema";
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
