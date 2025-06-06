import { Settings } from "@/types/settings";
import { User } from "@/types/user";
import { StateCreator } from "zustand";

export interface AppSlice {
    user: null | User;
    setUser: (user: User | null) => void;
    updateUser: (user: User) => void;
    settings: Settings;
    setSettings: (settings: Settings) => void;
    isMenuMinimized: boolean;
    setIsMenuMinimized: (isMinimized: boolean) => void;
    redirecting: boolean;
    setRedirecting: (isRedirecting: boolean) => void;
}


export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => ({
    user: null,
    setUser: (user: User | null) => set(() => ({ user })),
    updateUser: (user: User) => set((state) => ({ user: { ...state.user, ...user } })),
    settings: {
        show_as_me: 1,
    },
    setSettings: (settings: Settings) => set(() => ({ settings: settings })),
    isMenuMinimized: false,
    setIsMenuMinimized: (isMinimized: boolean) => set(() => ({ isMenuMinimized: isMinimized })),
    redirecting: false,
    setRedirecting: (isRedirecting) => set(() => ({ redirecting: isRedirecting }))
});