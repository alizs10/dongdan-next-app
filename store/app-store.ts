import { User } from "@/types/user-types";
import { create } from "zustand";

interface AppStoreState {
    user: null | User;
    setUser: (user: User) => void;
    updateUser: (user: User) => void;
}


export const useAppStore = create<AppStoreState>(
    (set) => ({
        user: null,
        setUser: (user: User) => set(() => ({ user })),
        updateUser: (user: User) => set((state) => ({ user: { ...state.user, ...user } })),
    })
);