import { AUTH_QUERY_KEYS } from "@/features/auth/auth.query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProfileInput } from "./update-profile.schema";
import { userService } from "./user.service";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      updateData,
      avatarFile,
    }: {
      updateData: UpdateProfileInput;
      avatarFile?: File;
    }) => userService.updateProfile(updateData, avatarFile),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEYS.profile,
      });
    },
  });
}
