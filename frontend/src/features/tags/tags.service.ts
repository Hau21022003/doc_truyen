import http from "@/lib/http";
import { PaginationResponse } from "@/shared/types/paginated-response.type";
import { CreateTagInput, UpdateTagInput } from "./tags.schema";
import { Tag } from "./tags.types";

export const tagsService = {
  // Create a new tag
  create: (data: CreateTagInput) => http.post<Tag>("/tags", data),

  // Get all tags with pagination
  findAll: (params?: { page?: number; limit?: number }) =>
    http.get<PaginationResponse<Tag>>("/tags", { params }),

  // Get a specific tag by ID
  findOne: (id: number) => http.get<Tag>(`/tags/${id}`),

  // Update a tag
  update: (id: number, data: UpdateTagInput) =>
    http.patch<Tag>(`/tags/${id}`, data),

  // Delete a tag
  remove: (id: number) => http.delete(`/tags/${id}`),
};
