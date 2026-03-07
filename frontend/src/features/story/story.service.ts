import http from "@/lib/http";
import { QUERY_SEPARATORS } from "@/shared/constants";
import { PaginationResponse } from "@/shared/types/paginated-response.type";
import { StoryQueryInput, UpsertStoryInput } from "./story.schema";
import { Story } from "./story.types";

export const storiesService = {
  create: (data: UpsertStoryInput) => http.post<Story>("/story", data),

  findOne: (id: number) => http.get<Story>(`/story/${id}`),

  findAll: (params?: StoryQueryInput) =>
    http.get<PaginationResponse<Story>>("/story", { params }),

  update: (id: number, data: UpsertStoryInput) =>
    http.patch<Story>(`/story/${id}`, data),

  remove: (id: number) => http.delete(`/story/${id}`),

  removeMany: (ids: number[]) =>
    http.delete(`/story/bulk`, {
      params: { ids: ids.join(QUERY_SEPARATORS.LIST) },
    }),
};
