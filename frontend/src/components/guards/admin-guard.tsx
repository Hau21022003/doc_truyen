"use client";
import { useAuthStore } from "@/shared/stores";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  // Nếu chưa có thông tin auth
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Nếu đã có thông tin nhưng chưa đăng nhập hoặc không phải admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <div>Unauthorized access</div>;
  }

  // Đã đăng nhập và là admin
  return <>{children}</>;
}
