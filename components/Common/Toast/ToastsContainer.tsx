'use client'

import { createPortal } from "react-dom";
import Toast from "./Toast";
import dynamic from "next/dynamic";
import { useToastStore } from "@/store/toast-store";
import { AnimatePresence } from "framer-motion";

function ToastsContainer() {

    const { toasts } = useToastStore(state => state);

    if (typeof window === 'object') {

        return createPortal(
            <div className="fixed bottom-10 left-10 w-[24rem] h-24 z-[9999]">
                <div className="relative p-3 h-full w-full">
                    <AnimatePresence>
                        {toasts.map((toast, index) => (
                            <Toast i={index} key={toast.id} toastId={toast.id} text={toast.message} scheme={toast.type} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            , document.getElementById('toasts-portal')!);
    }

    return null;

}

export default dynamic(() => Promise.resolve(ToastsContainer), { ssr: false });
