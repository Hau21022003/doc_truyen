import { useQuery } from "@tanstack/react-query";
import {
  QueryCommentsInput,
  QueryStoryCommentsInput,
} from "./story-comment.schema";
import { storyCommentsService } from "./story-comment.service";

export const STORY_COMMENTS_QUERY_KEYS = {
  all: ["story-comments"],
  lists: () => [...STORY_COMMENTS_QUERY_KEYS.all, "list"],
  list: (params: QueryStoryCommentsInput) => [
    ...STORY_COMMENTS_QUERY_KEYS.lists(),
    params,
  ],

  queries: () => [...STORY_COMMENTS_QUERY_KEYS.all, "query"],
  query: (params: QueryCommentsInput) => [
    ...STORY_COMMENTS_QUERY_KEYS.queries(),
    "list",
    params,
  ],
  detail: (id: number) => [...STORY_COMMENTS_QUERY_KEYS.all, "detail", id],
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

/**
 * Get comments for admin (with flags, reports)
 */
export const useCommentsQuery = (params: QueryCommentsInput) => {
  return useQuery({
    queryKey: STORY_COMMENTS_QUERY_KEYS.query(params),
    queryFn: () => storyCommentsService.findAll(params),
  });
};

/**
 * Get comment detail by ID (with reports)
 */
export const useCommentDetailQuery = (id: number) => {
  return useQuery({
    queryKey: STORY_COMMENTS_QUERY_KEYS.detail(id),
    queryFn: () => storyCommentsService.getDetail(id),
    enabled: !!id,
  });
};
