import http from "@/lib/http";
import { QUERY_SEPARATORS } from "@/shared/constants";
import { PaginationResponse } from "@/shared/types/paginated-response.type";
import { TagQueryInput, UpsertTagInput } from "./tags.schema";
import { Tag } from "./tags.types";

export const tagsService = {
  create: (data: UpsertTagInput) => http.post<Tag>("/tags", data),

  query: (params?: TagQueryInput) =>
    http.get<PaginationResponse<Tag>>("/tags", { params }),

  findAll: () => http.get<Tag[]>("/tags/all"),

  update: (id: number, data: UpsertTagInput) =>
    http.patch<Tag>(`/tags/${id}`, data),

  remove: (id: number) => http.delete(`/tags/${id}`),

  removeMany: (ids: number[]) =>
    http.delete(`/tags/bulk`, {
      params: { ids: ids.join(QUERY_SEPARATORS.LIST) },
    }),
};
