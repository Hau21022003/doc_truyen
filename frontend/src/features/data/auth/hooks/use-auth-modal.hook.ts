// src/features/auth/hooks/use-auth-modal.hook.ts
import { useAuthStore } from "@/shared/stores";
import { useAuthModalStore } from "@/shared/stores/auth-modal.store";
import { useCallback } from "react";

export function useAuthModal() {
  const { isAuthenticated } = useAuthStore();
  const openModal = useAuthModalStore((state) => state.openModal);
  const closeModal = useAuthModalStore((state) => state.closeModal);

  const requireAuth = useCallback(
    (callback?: () => void) => {
      console.log("// Kiểm tra user đã đăng nhập chưa", isAuthenticated);
      // Kiểm tra user đã đăng nhập chưa
      if (!isAuthenticated) {
        openModal("login");
        return false;
      }
      callback?.();
      return true;
    },
    [openModal, isAuthenticated],
  );

  return {
    openLoginModal: () => openModal("login"),
    openRegisterModal: () => openModal("register"),
    closeModal,
    requireAuth,
  };
}
