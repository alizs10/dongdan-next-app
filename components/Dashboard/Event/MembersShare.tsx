import { EventContext, type SettlementTransactions } from "@/context/EventContext";
import { TomanPriceFormatter } from "@/helpers/helpers";
import { Member } from "@/types/event-types";
import { Zap } from "lucide-react";
import { useContext } from "react";
import SettleHintsModal from "./SettleHintsModal";
import useStore from "@/store/store";


function MemberShareItem({ member }: { member: Member }) {

    const { showMemberName } = useContext(EventContext)

    return (
        <li key={member.id} className="flex w-full justify-between items-center">
            <div className="flex flex-row gap-x-2 justify-center items-center">
                <h1 className={`user_avatar_${member.scheme}_text`}>{showMemberName(member.id)}</h1>
                {member.balance_status === 'creditor' && (
                    <span className="text-[.6rem] rounded-full px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-500">
                        طلبکار
                    </span>
                )}
                {member.balance_status === 'debtor' && (
                    <span className="text-[.6rem] rounded-full px-2 py-1 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-500">
                        بدهکار
                    </span>
                )}
                {member.balance_status === 'settled' && (
                    <span className="text-[.6rem] rounded-full px-2 py-1 bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                        تسویه
                    </span>
                )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(Math.abs(member.balance || 0).toString())} تومان</span>
        </li>
    )
}

function MemberShareItemSkeleton() {
    return (
        <li className="flex w-full justify-between items-center">
            <div className="flex flex-row gap-x-2 justify-center items-center">
                <div className="w-14 bg-gray-400 dark:bg-gray-600 opacity-50 rounded-md animate-pulse h-5"></div>
                <div className="w-10 bg-gray-400 dark:bg-gray-600 opacity-50 rounded-full animate-pulse h-5"></div>
            </div>
            <div className="flex flex-row gap-x-1">
                <span className="w-10 bg-gray-400 dark:bg-gray-600 opacity-50 rounded-md animate-pulse h-5"></span>
                <span className="w-6 bg-gray-400 dark:bg-gray-600 opacity-50 rounded-md animate-pulse h-5"></span>
            </div>
        </li>
    )
}

export default function MembersShare({ members, toggleSettleHintsModal, isSettleHintsModalOpen }: { members: Member[], toggleSettleHintsModal: () => void, isSettleHintsModalOpen: boolean }) {

    const { user } = useStore()

    return (
        <div className="p-3 flex flex-col gap-y-8 border-b app_border_color">
            <div className="flex flex-row justify-between items-center">

                <div className="flex w-full justify-between items-center">
                    <h1 className="event_header_title">سهم اعضا</h1>
                    {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                </div>


                <button onClick={toggleSettleHintsModal} className="flex flex-row flex-nowrap gap-x-2 items-center w-fit rounded-full px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-600">
                    <Zap className="size-4" />
                    <p className="text-[.7rem] font-semibold text-nowrap">
                        تسویه حساب سریع
                    </p>
                </button>

                {isSettleHintsModalOpen && (
                    <SettleHintsModal onClose={toggleSettleHintsModal} />
                )}
            </div>


            <ul className="flex flex-col gap-y-4">

                {members.map(member => !user ? (
                    <MemberShareItemSkeleton key={member.id} />
                ) : (
                    <MemberShareItem key={member.id} member={member} />
                ))}


            </ul>
        </div>
    )
}
