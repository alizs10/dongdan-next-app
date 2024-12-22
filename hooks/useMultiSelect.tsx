import { useState } from "react";

function useMultiSelect() {

    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [selectMode, setSelectMode] = useState(false)

    function enableSelectMode() {
        setSelectedItems([])
        setSelectMode(true)
    }

    function disableSelectMode() {
        setSelectedItems([])
        setSelectMode(false)
    }

    function toggleItem(itemId: string) {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(prevState => prevState.filter(item => item !== itemId))
        } else {
            setSelectedItems([...selectedItems, itemId])
        }
    }

    function selectAllItems(allItems: string[]) {
        setSelectedItems(allItems)
    }

    return {
        selectedItems,
        selectMode,
        enableSelectMode,
        disableSelectMode,
        toggleItem,
        selectAllItems
    }
}

export default useMultiSelect;