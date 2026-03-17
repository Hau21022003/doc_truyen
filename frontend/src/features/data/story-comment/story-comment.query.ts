import { useQuery } from "@tanstack/react-query";
import { QueryStoryCommentsInput } from "./story-comment.schema";
import { storyCommentsService } from "./story-comment.service";

export const STORY_COMMENTS_QUERY_KEYS = {
  all: ["story-comments"],
  lists: () => [...STORY_COMMENTS_QUERY_KEYS.all, "list"],
  list: (params: QueryStoryCommentsInput) => [
    ...STORY_COMMENTS_QUERY_KEYS.lists(),
    params,
  ],
};

/**
 * Get comments by story ID
 */
export const useStoryCommentsQuery = (params: QueryStoryCommentsInput) => {
  return useQuery({
    queryKey: STORY_COMMENTS_QUERY_KEYS.list({
      storyId: params.storyId,
      page: params.page,
      limit: params.limit,
      chapterId: params.chapterId,
    }),
    queryFn: () => storyCommentsService.getByStory(params),
    enabled: !!params.storyId,
  });
};
