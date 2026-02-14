import { useAuthModal } from "@/features/auth/hooks/use-auth-modal.hook";
import { useProfileQuery } from "@/features/auth/queries/auth.query";
import { AUTH_EVENTS } from "@/shared/events/auth.events";
import { useAuthStore } from "@/shared/stores";
import { ReactNode, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser } = useAuthStore();
  const { data: profile, isError } = useProfileQuery();
  const { openLoginModal } = useAuthModal();

  useEffect(() => {
    // Only update the store if profile data exists
    setUser(profile?.payload ?? null);
  }, [profile, setUser]);

  useEffect(() => {
    // Lắng nghe sự kiện token hết hạn
    const handleTokenExpired = () => {
      setUser(null); // Xóa trạng thái auth
      openLoginModal(); // Mở login modal
    };

    window.addEventListener(AUTH_EVENTS.TOKEN_EXPIRED, handleTokenExpired);

    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener(AUTH_EVENTS.TOKEN_EXPIRED, handleTokenExpired);
    };
  }, [setUser, openLoginModal]);

  useEffect(() => {
    // Khi có lỗi, xóa user trạng thái
    if (isError) {
      setUser(null);
    }
  }, [isError, setUser]);

  return <>{children}</>;
}
