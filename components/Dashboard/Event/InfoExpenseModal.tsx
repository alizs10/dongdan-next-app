'use client'

import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { Expense } from "@/types/event-types";
import { useAppStore } from "@/store/app-store";
import { EventContext } from "@/context/EventContext";
import moment from "jalali-moment";
import { ArrowRightLeft, DollarSign, User } from "lucide-react";
import { TomanPriceFormatter } from "@/helpers/helpers";
import { RenderLabelIcon } from "../Events/EventItem";


function InfoExpenseModal({ onClose, expense }: { onClose: () => void, expense: Expense }) {

    const user = useAppStore(state => state.user)
    const { event } = useContext(EventContext);

    console.log(expense)

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title={'جزییات هزینه'} onClose={onClose} />

                    <div className="p-3 flex flex-col gap-y-4">

                        <div className="flex flex-row justify-between items-start">
                            <div className="flex flex-row gap-x-4 items-center">
                                <div className={`p-2 lg:p-3 rounded-full my-auto h-fit ${expense.type === 'transfer' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-300 dark:text-orange-500' : 'bg-green-50 dark:bg-green-950/30 text-green-400 dark:text-green-500'}`}>
                                    {expense.type === 'transfer' ? (
                                        <ArrowRightLeft className="size-6 lg:size-7 xl:size-8" />
                                    ) : (
                                        <DollarSign className="size-6 lg:size-7 xl:size-8" />
                                    )}
                                </div>
                                <h2 className="text-sm lg:text-base text-gray-700 dark:text-gray-300">{expense.type === 'transfer' ? 'جابه جایی پول' : 'هزینه'}: {expense.description}</h2>

                            </div>

                            <div className="flex flex-col items-end gap-y-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{moment(expense.date).locale('fa').format("DD MMM، YYYY")}</span>

                                <div className="rounded-full bg-gray-200 w-fit px-3 py-1 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex gap-x-1 items-center text-xs">
                                    <div className="scale-75">
                                        {RenderLabelIcon(event.label)}
                                    </div>
                                    <span>{event.name}</span>
                                </div>
                            </div>
                        </div>


                        {expense.type === 'expend' && (

                            <div className="flex flex-col gap-y-4">
                                <div className="flex flex-col gap-y-3">
                                    <span className={`text-base primary_text_color capitalize`}>پرداخت کننده</span>

                                    <div className={`px-4 select-none py-2 flex flex-row gap-x-4 items-center border user_avatar_${expense.payer.scheme}_text user_avatar_${expense.payer.scheme}_border user_avatar_${expense.payer.scheme}_bg w-fit rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>
                                        <span className="text-base">{expense.payer.member_id === user?.id ? 'خودم' : expense.payer.name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <span className={`text-base primary_text_color capitalize`}>مشارکت کننده ها</span>

                                    <div className="flex flex-wrap gap-2">

                                        {expense.contributors.map(member => (
                                            <div key={member.id} className={`px-4 select-none py-2 flex flex-row gap-x-4 items-center border user_avatar_${member.scheme}_text user_avatar_${member.scheme}_border user_avatar_${member.scheme}_bg w-fit rounded-full`}>
                                                <div className="">
                                                    <User className="size-5" />
                                                </div>

                                                <span className="text-base">{member.member_id === user?.id ? 'خودم' : member.name}</span>
                                            </div>
                                        ))}

                                    </div>

                                </div>

                                <div className="flex flex-col gap-y-3">
                                    <span className={`text-base primary_text_color capitalize`}>سهم هر عضو</span>
                                    <span className="w-full text-center py-3 text-base lg:text-lg font-semibold bg-gray-200 dark:bg-gray-800 app_text_color rounded-full">{TomanPriceFormatter((expense.amount / expense.contributors.length).toFixed(0))} تومان</span>
                                </div>

                                <div className="flex flex-col gap-y-3">
                                    <span className={`text-base primary_text_color capitalize`}>هزینه کل</span>
                                    <span className="w-full text-center py-3 text-lg lg:text-xl font-bold bg-indigo-100 dark:bg-indigo-950/50 primary_text_color rounded-full">{TomanPriceFormatter(expense.amount.toString())} تومان</span>
                                </div>
                            </div>
                        )}

                        {expense.type === 'transfer' && (

                            <div className="flex flex-col gap-y-4">
                                <div className="flex flex-col gap-y-3">
                                    <span className={`text-base primary_text_color capitalize`}>ارسال کننده</span>

                                    <div className={`px-4 select-none py-2 flex flex-row gap-x-4 items-center border user_avatar_${expense.transmitter.scheme}_text user_avatar_${expense.transmitter.scheme}_border user_avatar_${expense.transmitter.scheme}_bg w-fit rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>
                                        <span className="text-base">{expense.transmitter.member_id === user?.id ? 'خودم' : expense.transmitter.name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <span className={`text-base primary_text_color capitalize`}>دریافت کننده</span>

                                    <div className={`px-4 select-none py-2 flex flex-row gap-x-4 items-center border user_avatar_${expense.receiver.scheme}_text user_avatar_${expense.receiver.scheme}_border user_avatar_${expense.receiver.scheme}_bg w-fit rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>
                                        <span className="text-base">{expense.receiver.member_id === user?.id ? 'خودم' : expense.receiver.name}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-3">
                                    <span className={`text-base primary_text_color capitalize`}>مبلغ انتقال</span>
                                    <span className="w-full text-center py-3 text-lg lg:text-xl font-bold bg-indigo-100 dark:bg-indigo-950/50 primary_text_color rounded-full">{TomanPriceFormatter(expense.amount.toString())} تومان</span>
                                </div>
                            </div>
                        )}



                    </div>

                </section>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default InfoExpenseModal;