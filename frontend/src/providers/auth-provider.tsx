import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/shared/stores";
import { useProfileQuery } from "@/features/auth/queries/auth.query";
import { Loader2 } from "lucide-react";
import { AUTH_EVENTS } from "@/shared/events/auth.events";
import { useAuthModal } from "@/features/auth/hooks/use-auth-modal.hook";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, setUser } = useAuthStore();
  const { data: profile, isLoading, isError } = useProfileQuery();
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

  // Show loading state while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen w-screen items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin" />
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
