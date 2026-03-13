import http from "@/lib/http";
import { PaginationInput } from "@/shared/schemas";
import { PaginationResponse } from "@/shared/types";
import { ReadingHistory } from "./reading-history.types";

export const readingHistoryService = {
  /**
   * Get current user's reading history with pagination
   * Requires authentication
   */
  getMyHistory: (params: PaginationInput) =>
    http.get<PaginationResponse<ReadingHistory>>("/reading-history", {
      params,
    }),
};
