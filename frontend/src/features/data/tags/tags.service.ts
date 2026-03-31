import http from "@/lib/http";
import { QUERY_SEPARATORS } from "@/shared/constants";
import { ImportResult } from "@/shared/types/import";
import { PaginationResponse } from "@/shared/types/paginated-response.type";
import { TagQueryInput, UpsertTagInput } from "./tags.schema";
import { Tag } from "./tags.types";

export const tagsService = {
  create: (data: UpsertTagInput) => http.post<Tag>("/tags", data),

  query: (params?: TagQueryInput) =>
    http.get<PaginationResponse<Tag>>("/tags", { params }),

  findAll: async () => {
    return http.get<Tag[]>("/tags/all");
  },

  update: (id: number, data: UpsertTagInput) =>
    http.patch<Tag>(`/tags/${id}`, data),

  setFeatured: (id: number, isFeatured: boolean) =>
    http.patch<Tag>(`/tags/${id}/featured`, { isFeatured }),

  remove: (id: number) => http.delete(`/tags/${id}`),

  removeMany: (ids: number[]) =>
    http.delete(`/tags/bulk`, {
      params: { ids: ids.join(QUERY_SEPARATORS.LIST) },
    }),

  exportExcel: () => http.get("/tags/export/excel"),

  importExcel: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post<ImportResult>("/tags/import/excel", formData);
  },
};
