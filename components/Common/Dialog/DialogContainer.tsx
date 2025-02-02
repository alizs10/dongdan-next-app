'use client'


import useStore from "@/store/store";
import Dialog from "./Dialog";

function DialogContainer() {

    const { isOpen } = useStore()

    if (!isOpen) return null;

    return (
        <Dialog />
    );
}

export default DialogContainer;