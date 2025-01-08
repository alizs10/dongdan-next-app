import { TomanPriceFormatter, TomanPriceToNumber } from "@/helpers/helpers";
import { useAppStore } from "@/store/app-store";
import { SchemeType } from "@/types/event-types";
import { Ban, User, Users } from "lucide-react";
import { useCallback } from "react";

type Member = {
    id: number;
    name: string;
    scheme: SchemeType;
    member_id?: number;
    member_type?: string;
}

type PropsTypes = {
    label: string;
    members: Member[];
    onSelect: (actionKey: string) => void;
    onChangeAmount: (key: string, amount: string) => void;
    values: {
        key: string;
        amount: string;
    }[];
    error?: string;
    selectAllOption?: boolean;
    self?: {
        id: string;
        scheme: SchemeType;
        include: boolean;
        values?: boolean;
    };
    disabledInputs?: boolean;
}

function MemberSelectorWithAmountInput({ label, members, onSelect, onChangeAmount, values, error, self = undefined, selectAllOption = false, disabledInputs }: PropsTypes) {

    let membersCount = members.length;
    if (self && self.include) {
        membersCount++;
    }

    let valuesMembersCount = typeof values === 'object' ? values.length : 1;
    if (self && self.values) {
        valuesMembersCount++;
    }

    members = members.sort(((a, b) => {
        if (a.member_type?.includes("User")) return -1;
        if (b.member_type?.includes("User")) return 1;
        return 0;
    }));

    const { settings, user } = useAppStore(state => state);

    function isSelected(memberId: string) {
        return values.some(value => value.key === memberId);
    }

    const totalAmount = useCallback(() => {
        return values.reduce((acc, value) => {
            return acc + TomanPriceToNumber(value.amount);
        }, 0);
    }, [values])

    return (

        <div className="flex flex-col gap-y-2">

            <span className={`text-base ${error ? 'text-red-500' : 'primary_text_color'} capitalize`}>{label}</span>

            <div className="flex flex-wrap gap-4">

                {selectAllOption && (
                    <div key={'all'} onClick={onSelect.bind(null, 'all')} className={`px-4 select-none cursor-pointer py-2 flex flex-row justify-between items-center border ${valuesMembersCount === membersCount ? `w-full user_avatar_blue_text user_avatar_blue_border user_avatar_blue_bg` : 'user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                        <div className="flex flex-row gap-x-2 items-center">
                            <div className="">
                                <Users className="size-5" />
                            </div>
                            <span className="text-base">همه</span>
                        </div>

                        {valuesMembersCount === membersCount && (
                            <span className={`text-sm user_avatar_blue_text`}>{TomanPriceFormatter(totalAmount().toString())} تومان</span>
                        )}
                    </div>
                )}

                {self && self.include && (
                    <div key={'self'} onClick={onSelect.bind(null, 'self')} className={`px-4 select-none cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${self.values ? `user_avatar_${self.scheme}_text user_avatar_${self.scheme}_border user_avatar_${self.scheme}_bg` : 'user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                        <div className="">
                            <User className="size-5" />
                        </div>

                        <span className="text-base">{settings.show_as_me ? 'خودم' : user?.name}</span>
                    </div>
                )}

                <div className="flex flex-wrap gap-4">
                    {members.map(member => (
                        <div key={member.id} onClick={onSelect.bind(null, member.id.toString())} className={`px-4 select-none py-2 flex flex-row justify-between items-center border ${isSelected(member.id.toString()) ? `w-full cursor-pointer user_avatar_${member.scheme}_text user_avatar_${member.scheme}_border user_avatar_${member.scheme}_bg` : 'w-fit cursor-pointer user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                            <div className="flex flex-row gap-x-2 items-center">
                                <div className="">
                                    <User className="size-5" />
                                </div>
                                <span className="text-base">{member.member_id?.toString() === self?.id ? settings.show_as_me ? 'خودم' : user?.name : member.name}</span>
                            </div>

                            {isSelected(member.id.toString()) && (
                                <div className="flex flex-row gap-x-2 items-center">

                                    <input
                                        type="text"
                                        onClick={e => e.stopPropagation()}
                                        disabled={disabledInputs ?? false}
                                        value={values.find(value => value.key === member.id.toString())?.amount}
                                        onChange={(e) => onChangeAmount(member.id.toString(), e.target.value)}
                                        placeholder="مبلغ"
                                        className={`text-right text-base user_avatar_${member.scheme}_text border-b user_avatar_${member.scheme}_bg user_avatar_${member.scheme}_border px-3 py-1 outline-none`} />
                                    <span className={`text-sm user_avatar_${member.scheme}_text`}>تومان</span>
                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>


            {error && (
                <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                    <Ban className="size-3.5" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

export default MemberSelectorWithAmountInput;