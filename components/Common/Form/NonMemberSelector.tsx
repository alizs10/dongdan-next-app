import { EventContext } from "@/context/EventContext";
import useStore from "@/store/store";
import { SchemeType } from "@/types/event-types";
import { Ban, User, Users } from "lucide-react";
import { useCallback, useContext } from "react";

type Member = {
    id: number;
    name: string;
    scheme: SchemeType;
    member_id?: number;
    member_type?: string;
}

type PropsTypes = {
    label?: string;
    members: Member[];
    onSelect: (actionKey: string) => void;
    value: string | string[];
    error?: string;
    selectAllOption?: boolean;
    self?: {
        id: string;
        scheme: SchemeType;
        include: boolean;
        value?: boolean;
    };
    disalllows?: string[];
}

function NonMemberSelector({ label, members, onSelect, value, error, self = undefined, selectAllOption = false, disalllows = [] }: PropsTypes) {

    let membersCount = members.length;
    if (self && self.include) {
        membersCount++;
    }

    let valueMembersCount = typeof value === 'object' ? value.length : 1;
    if (self && self.value) {
        valueMembersCount++;
    }

    members = members.sort(((a, b) => {
        if (a.member_type?.includes("User")) return -1;
        if (b.member_type?.includes("User")) return 1;
        return 0;
    }));

    const { user, settings } = useStore()

    console.log("members", members)

    const showMemberName = useCallback((memberId: number) => {

        if (!user) return '...';

        if (self && self.include && memberId === user.id) {
            return settings.show_as_me ? 'خودم' : user.name
        }

        const member = members.find(member => member.id === memberId);
        if (!member) return 'ناشناس';
        let memberName = member.member_id === user.id ? settings.show_as_me ? 'خودم' : user.name : member.name;

        if (memberName.length > 12) {
            const memberNameArr = memberName.split(" ");
            memberName = memberNameArr.length > 1 ? memberNameArr[1] : memberName.slice(0, 12);
        }

        return memberName;


    }, [members, settings, user]);

    return (

        <div className="flex flex-col gap-y-2">
            {label && (
                <span className={`text-base ${error ? 'text-red-500' : 'primary_text_color'} capitalize`}>{label}</span>
            )}

            <div className="flex flex-wrap gap-4">

                {selectAllOption && (
                    <div key={'all'} onClick={onSelect.bind(null, 'all')} className={`px-4 select-none cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${valueMembersCount === membersCount ? `user_avatar_blue_text user_avatar_blue_border user_avatar_blue_bg` : 'user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                        <div className="">
                            <Users className="size-5" />
                        </div>

                        <span className="text-base">همه</span>
                    </div>
                )}

                {(self && self.include) && (
                    <div key={'self'} onClick={onSelect.bind(null, 'self')} className={`px-4 select-none cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${self.value ? `user_avatar_${self.scheme}_text user_avatar_${self.scheme}_border user_avatar_${self.scheme}_bg` : 'user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                        <div className="">
                            <User className="size-5" />
                        </div>

                        <span className="text-base">{showMemberName(parseInt(self.id))}</span>
                    </div>
                )}

                {members.map(member => (
                    <div key={member.id} onClick={onSelect.bind(null, member.id.toString())} className={`px-4 select-none py-2 flex flex-row gap-x-4 items-center border ${disalllows.includes(member.id.toString()) ? 'border-gray-300 text-gray-300 dark:text-gray-800 dark:border-gray-800 cursor-not-allowed' : ((typeof value === 'string' && member.id.toString() === value) || (typeof value === 'object' && value.includes(member.id.toString()))) ? `cursor-pointer user_avatar_${member.scheme}_text user_avatar_${member.scheme}_border user_avatar_${member.scheme}_bg` : 'cursor-pointer user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                        <div className="">
                            <User className="size-5" />
                        </div>

                        <span className="text-base">{showMemberName(member.id)}</span>
                    </div>
                ))}

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

export default NonMemberSelector;