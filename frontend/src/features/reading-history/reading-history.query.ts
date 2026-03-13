import { PaginationInput } from "@/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import { readingHistoryService } from "./reading-history.service";

export const READING_HISTORY_QUERY_KEYS = {
  all: ["reading-history"],
  lists: () => [...READING_HISTORY_QUERY_KEYS.all, "list"],
  list: (params: PaginationInput) => [
    ...READING_HISTORY_QUERY_KEYS.lists(),
    params,
  ],
};

/**
 * Get current user's reading history
 * Requires authentication
 */
export const useReadingHistoryQuery = (params: PaginationInput = {}) => {
  return useQuery({
    queryKey: READING_HISTORY_QUERY_KEYS.list(params),
    queryFn: () => readingHistoryService.getMyHistory(params),
  });
};
