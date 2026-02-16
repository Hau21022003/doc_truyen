import { useAuthStore } from "@/shared/stores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS } from "../queries";
import { authService } from "../services";

/**
 * LOGIN
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,

    onSuccess: async () => {
      // Refetch profile sau khi login thành công
      await queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEYS.profile,
      });
    },
  });
};

/**
 * REGISTER
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,

    onSuccess: async () => {
      // Sau register, auto login
      await queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEYS.profile,
      });
    },
  });
};

/**
 * LOGOUT
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore(); // Import setUser

  return useMutation({
    mutationFn: authService.logout,

    // Optimistic update - xóa user ngay lập tức
    // onMutate: async () => {
    //   setUser(null);
    // },

    onSuccess: async () => {
      // Clear toàn bộ auth cache
      await queryClient.removeQueries({
        queryKey: AUTH_QUERY_KEYS.profile,
      });
      setUser(null);
    },

    onError: (error) => {
      // Nếu logout thất bại, refetch lại profile để khôi phục trạng thái
      queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEYS.profile,
      });
    },
  });
};
