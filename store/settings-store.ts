import { create } from "zustand";

export type SettingsState = {
    calcAccuracy: boolean;
    toggleCalcAccuracy: () => void;
    selfIncluding: boolean;
    toggleSelfIncluding: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
    
    calcAccuracy: true,
    toggleCalcAccuracy: () => set(state => ({ calcAccuracy: !state.calcAccuracy })),
    selfIncluding: true,
    toggleSelfIncluding: () => set(state => ({ selfIncluding: !state.selfIncluding })),
}));