import http from "@/lib/http";
import { PaginationResponse } from "@/shared/types";
import { BookmarkQueryInput, CreateBookmarkInput } from "./bookmark.schema";
import { Bookmark } from "./bookmark.types";

export const bookmarkService = {
  create: (data: CreateBookmarkInput) => http.post<Bookmark>("/bookmark", data),

  getByUser: (params: BookmarkQueryInput) =>
    http.get<PaginationResponse<Bookmark>>("/bookmark", { params }),
};
