import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  modal: React.ReactNode;
  setModal: (modal: React.ReactNode) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modal: null,
  setModal: (modal) => set({ modal }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
