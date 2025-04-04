import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createToastSlice } from './slices/toastSlice';
import { StoreState } from './types';
import { createAppSlice } from './slices/appSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import { createDialogSlice } from './slices/dialogSlice';
import { createPersonalSlice } from './slices/personalSlice';


const useStore = create<StoreState>()(
    devtools(
        persist(
            (...a) => ({
                ...createAppSlice(...a),
                ...createToastSlice(...a),
                ...createSettingsSlice(...a),
                ...createDialogSlice(...a),
                ...createPersonalSlice(...a),
            }),
            {
                name: 'app-storage', // Unique name for the persisted state
                // storage: createJSONStorage(() => localStorage), // Use localStorage
            }
        )
    )
);

export default useStore;