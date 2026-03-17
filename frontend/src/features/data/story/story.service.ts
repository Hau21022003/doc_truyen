import http from "@/lib/http";
import { QUERY_SEPARATORS, SortDirection } from "@/shared/constants";
import { PaginationResponse } from "@/shared/types/paginated-response.type";
import { StoryQueryInput, UpsertStoryInput } from "./story.schema";
import {
  HomepageStory,
  HomeStoryQuery,
  RateStoryResponse,
  Story,
} from "./story.types";

export const storyService = {
  create: (data: UpsertStoryInput) => http.post<Story>("/story", data),

  findOne: (id: number) => http.get<Story>(`/story/${id}`),

  findBySlug: (slug: string, chapterSort?: SortDirection) =>
    http.get<Story>(`/story/slug/${slug}`, { params: { chapterSort } }),

  findAll: (params?: StoryQueryInput) =>
    http.get<PaginationResponse<Story>>("/story", { params }),

  findHomepage: (params?: HomeStoryQuery) =>
    http.get<PaginationResponse<HomepageStory>>("/story/home", {
      params,
    }),

  findHotStories: (limit?: number) =>
    http.get<PaginationResponse<HomepageStory>>("/story/hot-stories", {
      params: { limit },
    }),

  update: (id: number, data: UpsertStoryInput) =>
    http.patch<Story>(`/story/${id}`, data),

  remove: (id: number) => http.delete(`/story/${id}`),

  removeMany: (ids: number[]) =>
    http.delete(`/story/bulk`, {
      params: { ids: ids.join(QUERY_SEPARATORS.LIST) },
    }),

  rate: (data: { storyId: number; rating: number }) =>
    http.post<RateStoryResponse>("/story-rating/rate", data),
};
