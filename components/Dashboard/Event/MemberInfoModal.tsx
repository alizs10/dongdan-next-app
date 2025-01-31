'use client'

import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { EventContext } from "@/context/EventContext";
import { TomanPriceFormatter } from "@/helpers/helpers";
import { useAppStore } from "@/store/app-store";
import { Member } from "@/types/event-types";
import { User } from "lucide-react";
import { useContext } from "react";

type PropsTypes = {
    onClose: () => void,
    member: Member;
}


function MemberInfoModal({ onClose, member }: PropsTypes) {

    const user = useAppStore(state => state.user)

    const {
        getAllPersonExpends,
        getAllPersonDebts,
        getAllPersonRecieved,
        getAllPersonSent,
        getPersonBalance,
        getPersonBalanceStatus
    } = useContext(EventContext)


    const translateBalanceStatus = (status: 'debtor' | 'creditor' | 'settled') => {
        switch (status) {
            case 'debtor': return 'بدهکار';
            case 'creditor': return 'طلبکار';
            case 'settled': return 'تسویه شده';
        }
    }

    return (
        <ModalWrapper onClose={onClose}>

            <section onClick={e => e.stopPropagation()} className="modal_container">
                <ModalHeader title="جزییات دوست" onClose={onClose} />

                <div className="p-5 grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex flex-row items-center gap-x-2">
                        <span className={`p-3 w-fit rounded-full border user_avatar_${member.scheme}_text user_avatar_${member.scheme}_border user_avatar_${member.scheme}_bg`}>
                            <User className="size-5" />
                        </span>
                        <span className={`user_avatar_${member.scheme}_text text-base`}>{member.member_id === user?.id ? 'خودم' : member.name}</span>
                    </div>

                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">مجموع هزینه کرد ها:</span>
                        <span className="text-base text-gray-700 dark:text-gray-300">{TomanPriceFormatter(member.total_expends_amount?.toString() || '0')} تومان</span>
                    </div>
                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">سهم در مخارج:</span>
                        <span className="text-base text-gray-700 dark:text-gray-300">{TomanPriceFormatter(member.total_contributions_amount?.toString() || '0')} تومان</span>
                    </div>
                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">مجموع پول های دریافتی:</span>
                        <span className="text-base text-gray-700 dark:text-gray-300">{TomanPriceFormatter(member.total_recieved_amount?.toString() || '0')} تومان</span>
                    </div>
                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">مجموع پول های ارسالی:</span>
                        <span className="text-base text-gray-700 dark:text-gray-300">{TomanPriceFormatter(member.total_sent_amount?.toString() || '0')} تومان</span>
                    </div>
                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">وضعیت تسویه:</span>
                        <span className="text-base text-gray-700 dark:text-gray-300">{translateBalanceStatus(member.balance_status || 'settled')}</span>
                    </div>
                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">تسویه:</span>
                        <span className="text-base text-gray-700 dark:text-gray-300">{TomanPriceFormatter(Math.abs(member.balance || 0).toString())} تومان</span>
                    </div>

                </div>
            </section>

        </ModalWrapper>
    );
}

export default MemberInfoModal;