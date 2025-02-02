import { Settings } from "@/types/settings";
import { User } from "@/types/user";
import { StateCreator } from "zustand";

export interface AppSlice {
    user: null | User;
    setUser: (user: User) => void;
    updateUser: (user: User) => void;
    settings: Settings;
    setSettings: (settings: Settings) => void;
}

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => ({
    user: null,
    setUser: (user: User) => set(() => ({ user })),
    updateUser: (user: User) => set((state) => ({ user: { ...state.user, ...user } })),
    settings: {
        show_as_me: 1,
    },
    setSettings: (settings: Settings) => set((state) => ({ settings: settings })),
});