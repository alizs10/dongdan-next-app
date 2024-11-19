'use client'

import { createPortal } from "react-dom";
import Toast from "./Toast";
import dynamic from "next/dynamic";
import { useToastStore } from "@/store/toast-store";
import { AnimatePresence } from "framer-motion";

function ToastsContainer() {

    const { toasts } = useToastStore(state => state);

    if (toasts.length === 0) return null;

    if (typeof window === 'object') {

        return createPortal(
            <div className="fixed bottom-5 lg:bottom-10 left-5 lg:left-10 right-5 md:right-auto md:w-[24rem] h-20 md:h-24 z-[9999]">
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
