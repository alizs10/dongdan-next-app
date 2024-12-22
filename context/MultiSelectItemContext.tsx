'use client'

import useMultiSelect from "@/hooks/useMultiSelect";
import { createContext } from "react";

type MultiSelectItemContextType = {
    disableSelectMode: () => void;
    enableSelectMode: () => void;
    selectAllItems: (allItems: string[]) => void;
    selectMode: boolean;
    selectedItems: string[];
    toggleItem: (itemId: string) => void;
}

export const MultiSelectItemContext = createContext<MultiSelectItemContextType>({
    disableSelectMode: () => { },
    enableSelectMode: () => { },
    selectAllItems: () => { },
    selectMode: false,
    selectedItems: [],
    toggleItem: () => { }
});

export function MultiSelectItemContextProvider({ children }: { children: React.ReactNode }) {

    const {
        disableSelectMode,
        enableSelectMode,
        selectAllItems,
        selectMode,
        selectedItems,
        toggleItem } = useMultiSelect();


    const values = {
        disableSelectMode,
        enableSelectMode,
        selectAllItems,
        selectMode,
        selectedItems,
        toggleItem
    }

    return (
        <MultiSelectItemContext.Provider value={values}>
            {children}
        </MultiSelectItemContext.Provider>
    )
}