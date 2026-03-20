import { useQuery } from "@tanstack/react-query";
import { QueryUsersInput } from "./update-profile.schema";
import { userService } from "./user.service";

export const USERS_QUERY_KEYS = {
  all: ["users"],
  lists: () => [...USERS_QUERY_KEYS.all, "list"],
  list: (params?: any) => [...USERS_QUERY_KEYS.lists(), params],
};

/**
 * Get all users with pagination and filters
 */
export const useUsersQuery = (params?: QueryUsersInput) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.list(params || {}),
    queryFn: () => userService.findAll(params),
  });
};
