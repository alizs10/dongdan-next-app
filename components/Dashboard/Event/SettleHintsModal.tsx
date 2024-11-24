import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { Handshake, Smile, Zap } from "lucide-react";
import { createPortal } from "react-dom";



function SettleHintsModal({ onClose, transactions }: { onClose: () => void, transactions: string[] }) {

    if (typeof window !== 'undefined') {
        return createPortal(
            <ModalWrapper onClose={onClose} >
                <div onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 app_bg_color rounded-2xl">
                    <ModalHeader title="راهنمای تسویه حساب" onClose={onClose} />

                    {transactions.length > 0 ? (

                        <ul className="py-10 px-5 flex flex-col gap-y-4">
                            {transactions.map((transaction, index) => (
                                <li key={index} className="flex flex-wrap gap-x-2 items-center text-base text-gray-700">
                                    <Zap className="size-4 text-indigo-700" />
                                    <span>{transaction}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="w-full py-20  px-5  justify-center items-center flex flex-col gap-y-4">
                            <Handshake className="size-44 text-gray-300" />
                            <span className="text-sm text-gray-500">تمام حساب ها تسویه است</span>
                        </div>
                    )}

                </div>
            </ModalWrapper >
            , document.getElementById('modal-portal')!);
    }
    return null;
}

export default SettleHintsModal;