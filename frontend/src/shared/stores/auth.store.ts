import { User } from "@/features/users/types";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Để biết liệu đã check auth lần đầu chưa
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Bắt đầu ở trạng thái loading
  isInitialized: false, // Chưa khởi tạo
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false, // Khi đã có user, không còn loading
      isInitialized: true,
    }),
}));
