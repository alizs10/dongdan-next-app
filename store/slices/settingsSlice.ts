import { StateCreator } from "zustand";

export interface SettingsSlice {
    calcAccuracy: boolean;
    toggleCalcAccuracy: () => void;
    selfIncluding: boolean;
    toggleSelfIncluding: () => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
    calcAccuracy: true,
    toggleCalcAccuracy: () => set(state => ({ calcAccuracy: !state.calcAccuracy })),
    selfIncluding: true,
    toggleSelfIncluding: () => set(state => ({ selfIncluding: !state.selfIncluding })),
});