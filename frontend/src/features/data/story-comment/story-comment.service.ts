import http from "@/lib/http";
import { PaginationResponse } from "@/shared/types";
import {
  CreateStoryCommentInput,
  QueryStoryCommentsInput,
} from "./story-comment.schema";
import { StoryComment } from "./story-comment.types";

export const storyCommentsService = {
  create: (data: CreateStoryCommentInput) =>
    http.post<StoryComment>("/story-comment", data),

  getByStory: async (params: QueryStoryCommentsInput) => {
    return http.get<PaginationResponse<StoryComment>>(
      `/story-comment/story/${params.storyId}`,
      {
        params,
      },
    );
  },
};
