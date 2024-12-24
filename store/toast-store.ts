import { generateUID } from "@/helpers/helpers";
import { create } from "zustand";

export type Toast = {
    id: string;
    message: string;
    type: 'success' | 'danger' | 'warning' | 'info' | 'accent';
};

type ToastStoreTypes = {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (toastId: string) => void;
};

export const useToastStore = create<ToastStoreTypes>()((set) => ({
    toasts: [],
    addToast: (toast) => set((state) => ({ toasts: [{ id: generateUID(), ...toast }, ...state.toasts.reverse().slice(-2).reverse()] })),
    removeToast: (toastId) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== toastId) })),
}));