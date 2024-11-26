import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { Handshake, Zap } from "lucide-react";
import { createPortal } from "react-dom";



function SettleHintsModal({ onClose, transactions }: { onClose: () => void, transactions: string[] }) {

    if (typeof window !== 'undefined') {
        return createPortal(
            <ModalWrapper onClose={onClose} >
                <div onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="راهنمای تسویه حساب" onClose={onClose} />

                    {transactions.length > 0 ? (

                        <ul className="py-10 px-5 flex flex-col gap-y-4">
                            {transactions.map((transaction, index) => (
                                <li key={index} className="flex flex-wrap gap-x-2 items-center text-base text-gray-700 dark:text-gray-300">
                                    <Zap className="size-5 text-indigo-700" />
                                    <span>{transaction}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="w-full py-20  px-5  justify-center items-center flex flex-col gap-y-4">
                            <Handshake className="size-44 text-gray-300 dark:text-gray-800" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">تمام حساب ها تسویه است</span>
                        </div>
                    )}

                </div>
            </ModalWrapper >
            , document.getElementById('modal-portal')!);
    }
    return null;
}

export default SettleHintsModal;