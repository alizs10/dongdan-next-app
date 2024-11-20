import { create } from "zustand";

export type SettingsState = {
    calcAccuracy: boolean;
    toggleCalcAccuracy: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
    
    calcAccuracy: true,
    toggleCalcAccuracy: () => set(state => ({ calcAccuracy: !state.calcAccuracy })),
}));