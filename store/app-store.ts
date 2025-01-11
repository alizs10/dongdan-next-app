import { Settings } from "@/types/settings";
import { User } from "@/types/user";
import { create } from "zustand";

interface AppStoreState {
    user: null | User;
    setUser: (user: User) => void;
    updateUser: (user: User) => void;
    settings: Settings;
    setSettings: (settings: Settings) => void;
}


export const useAppStore = create<AppStoreState>(
    (set) => ({
        user: null,
        setUser: (user: User) => set(() => ({ user })),
        updateUser: (user: User) => set((state) => ({ user: { ...state.user, ...user } })),
        settings: {
            show_as_me: 1,
        },
        setSettings: (settings: Settings) => set((state) => ({ settings: settings })),
    })
);