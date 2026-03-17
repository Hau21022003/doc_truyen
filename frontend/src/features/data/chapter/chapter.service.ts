import http from "@/lib/http";
import { PaginationResponse } from "@/shared/types/paginated-response.type";
import { ChapterStatus } from "./chapter.constants";
import { ChapterQueryInput, UpsertChapterInput } from "./chapter.schema";
import { Chapter, ChapterWithContent } from "./chapter.types";

export const chaptersService = {
  create: (data: UpsertChapterInput) => http.post<Chapter>("/chapters", data),

  query: (params?: ChapterQueryInput) =>
    http.get<PaginationResponse<Chapter>>("/chapters", { params }),

  getById: (id: number, includeContent = false) =>
    http.get<ChapterWithContent>(`/chapters/${id}`, {
      params: { includeContent: includeContent.toString() },
    }),

  // getChapterDetailForUser: (id: number) =>
  //   http.get<ChapterWithContent>(`/chapters/${id}/read`),
  getByStorySlugAndNumber: (storySlug: string, chapterNumber: number) =>
    http.get<ChapterWithContent>(
      `/chapters/story/${storySlug}/${chapterNumber}`,
    ),

  getByStoryId: (storyId: number, query: ChapterQueryInput) =>
    http.get<PaginationResponse<Chapter>>(`/chapters/story/${storyId}`, {
      params: query,
    }),

  update: async (id: number, data: UpsertChapterInput) =>
    http.patch<Chapter>(`/chapters/${id}`, data),

  remove: (id: number) => http.delete(`/chapters/${id}`),

  removeMany: (ids: number[]) =>
    http.delete(`/chapters/bulk`, {
      params: { ids: ids },
    }),

  updateStatus: (id: number, status: ChapterStatus) =>
    http.patch<Chapter>(`/chapters/${id}/status`, { status }),
};
