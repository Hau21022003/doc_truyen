import http from "@/lib/http";
import { PaginationResponse } from "@/shared/types";
import {
  CreateStoryCommentInput,
  QueryCommentsInput,
  QueryStoryCommentsInput,
  ReportCommentInput,
} from "./story-comment.schema";
import {
  AdminStoryComment,
  CommentDetail,
  StoryComment,
} from "./story-comment.types";

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

  report: (commentId: number, data: ReportCommentInput) => {
    return http.post<{
      success: boolean;
      message: string;
    }>(`/story-comment/${commentId}/report`, data);
  },

  /**
   * Lấy danh sách comments cho admin (with flags, reports)
   */
  findAll: (params: QueryCommentsInput) => {
    return http.get<PaginationResponse<AdminStoryComment>>("/story-comment", {
      params,
    });
  },

  /**
   * Lấy chi tiết comment theo ID (kèm reports)
   */
  getDetail: (id: number) => {
    return http.get<CommentDetail>(`/story-comment/${id}`);
  },

  delete: (id: number) => {
    return http.delete(`/story-comment/${id}`);
  },

  deleteMany: (ids: number[]) => {
    return http.delete(`/story-comment/bulk`, {
      params: { ids },
    });
  },
};
