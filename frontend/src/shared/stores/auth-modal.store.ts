// src/shared/stores/auth-modal.store.ts
import { create } from "zustand";

interface AuthModalState {
  isOpen: boolean;
  view: "login" | "register";
  isLoading: boolean;
  openModal: (view?: "login" | "register") => void;
  closeModal: () => void;
  setView: (view: "login" | "register") => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  view: "login",
  isLoading: false,
  openModal: (view = "login") => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false }),
  setView: (view) => set({ view }),
  setLoading: (isLoading) => set({ isLoading }),
}));
