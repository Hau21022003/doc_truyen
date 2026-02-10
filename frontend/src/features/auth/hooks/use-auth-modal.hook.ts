// src/features/auth/hooks/use-auth-modal.hook.ts
import { useCallback } from "react";
import { useAuthModalStore } from "@/shared/stores/auth-modal.store";
import { useAuthStore } from "@/shared/stores";

export function useAuthModal() {
  const { isAuthenticated } = useAuthStore();
  const openModal = useAuthModalStore((state) => state.openModal);
  const closeModal = useAuthModalStore((state) => state.closeModal);

  const requireAuth = useCallback(
    (callback?: () => void) => {
      // Kiểm tra user đã đăng nhập chưa
      if (!isAuthenticated) {
        openModal("login");
        return false;
      }
      callback?.();
      return true;
    },
    [openModal],
  );

  return {
    openLoginModal: () => openModal("login"),
    openRegisterModal: () => openModal("register"),
    closeModal,
    requireAuth,
  };
}
