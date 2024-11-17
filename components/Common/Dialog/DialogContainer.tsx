'use client'

import { useDialogStore } from "@/store/dialog-store";
import Dialog from "./Dialog";

function DialogContainer() {

    const isOpen = useDialogStore(state => state.isOpen)

    if (!isOpen) return null;

    return (
        <Dialog />
    );
}

export default DialogContainer;