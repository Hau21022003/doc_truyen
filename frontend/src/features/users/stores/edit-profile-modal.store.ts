import { create } from "zustand";

interface EditProfileModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useEditProfileModalStore = create<EditProfileModalStore>(
  (set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  }),
);
