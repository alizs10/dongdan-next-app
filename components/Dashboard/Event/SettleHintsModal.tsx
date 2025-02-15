import { createExpenseReq } from "@/app/actions/event";
import Button from "@/components/Common/Button";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { EventContext, SettlementTransactions } from "@/context/EventContext";
import { TomanPriceFormatter } from "@/helpers/helpers";
import useStore from "@/store/store";
import { CreateTransferRequest } from "@/types/requests/event";
import { CreditCard, Handshake, Minus, MoveLeft, User } from "lucide-react";
import { useContext } from "react";
import { createPortal } from "react-dom";



function SettleHintsModal({ onClose, transactions }: {
    onClose: () => void, transactions: {
        hints: string[];
        transactions: SettlementTransactions[];
    }
}) {


    console.log(transactions)

    const { user, addToast } = useStore()
    const { event, addExpense } = useContext(EventContext)

    async function onSettleButtonClick(transaction: SettlementTransactions) {

        let newTransferInputs: CreateTransferRequest = {
            amount: transaction.amount.toString(),
            description: "تسویه حساب",
            date: new Date(),
            type: 'transfer',
            transmitter_id: transaction.transmitter.id.toString(),
            receiver_id: transaction.receiver.id.toString()
        }

        let res = await createExpenseReq(event.id, newTransferInputs)

        if (res.success) {

            // addExpense(res.expense)
            const successToast = {
                message: 'تسویه حساب با موفقیت انجام شد',
                type: 'success' as const
            }
            addToast(successToast)
            return
        }

        const errorToast = {
            message: res.message,
            type: 'danger' as const
        }
        addToast(errorToast)

    }


    if (typeof window !== 'undefined') {
        return createPortal(
            <ModalWrapper onClose={onClose} >
                <div onClick={e => e.stopPropagation()} className="!min-w-fit modal_container">
                    <ModalHeader title="راهنمای تسویه حساب" onClose={onClose} />

                    {transactions.hints.length > 0 ? (
                        <ul className="px-3 py-5 flex flex-col gap-y-6">
                            {transactions.transactions.map((transaction, index) => (
                                <li key={index} className="flex flex-row gap-x-2 items-center text-base text-gray-700 dark:text-gray-300">
                                    <div className={`px-3 select-none py-2 flex flex-row gap-x-2 items-center border user_avatar_${transaction.transmitter.scheme}_text user_avatar_${transaction.transmitter.scheme}_border user_avatar_${transaction.transmitter.scheme}_bg w-fit rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>
                                        <span className="text-sm line-clamp-1">{transaction.transmitter.member_id === user?.id ? 'خودم' : transaction.transmitter.name}</span>
                                    </div>

                                    <Minus className="size-5 text-gray-500 dark:text-gray-400" />
                                    <span className="w-fit text-center px-3 py-2 text-sm font-semibold bg-indigo-100 dark:bg-indigo-950/50 primary_text_color rounded-full">{TomanPriceFormatter(transaction.amount.toString())} تومان</span>

                                    <MoveLeft className="size-5 text-gray-500 dark:text-gray-400" />

                                    <div className={`px-3 select-none py-2 flex flex-row gap-x-2 items-center border user_avatar_${transaction.receiver.scheme}_text user_avatar_${transaction.receiver.scheme}_border user_avatar_${transaction.receiver.scheme}_bg w-fit rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>
                                        <span className="text-sm line-clamp-1">{transaction.receiver.member_id === user?.id ? 'خودم' : transaction.receiver.name}</span>
                                    </div>

                                    <div className="w-fit mr-auto">

                                        <Button
                                            text="تسویه"
                                            color="success"
                                            icon={<CreditCard className="size-5" />}
                                            size="small"
                                            onClick={() => onSettleButtonClick(transaction)}
                                        />
                                    </div>
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