import { create } from "zustand";

const createToast = (message, type) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  message,
  type,
});

export const useToastStore = create((set) => ({
  toasts: [],
  showToast: (message, type = "success") => {
    const toast = createToast(message, type);
    set((state) => ({ toasts: [...state.toasts, toast] }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== toast.id) }));
    }, 3500);
  },
  success: (message) => useToastStore.getState().showToast(message, "success"),
  error: (message) => useToastStore.getState().showToast(message, "error"),
  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));
