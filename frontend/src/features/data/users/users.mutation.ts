import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "./user.service";
import { USERS_QUERY_KEYS } from "./users.query";

/**
 * DELETE USER
 */
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEYS.lists(),
      });
    },
  });
};

/**
 * DELETE MANY USERS
 */
export const useDeleteManyUsersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.removeMany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEYS.lists(),
      });
    },
  });
};
