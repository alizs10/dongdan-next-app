import { Contact } from "@/types/contact-types";
import { Person } from "@/types/event-types";
import { Ban, User } from "lucide-react";

type PropsTypes = {
    label: string;
    members: Person[] | Contact[];
    onSelect: (id: string) => void;
    value: string | string[];
    error?: string;
    selectAllOption?: boolean;
    disalllows?: string[];
}

function MemberSelector({ label, members, onSelect, value, error, selectAllOption = false, disalllows = [] }: PropsTypes) {
    return (

        <div className="flex flex-col gap-y-2">

            <span className={`text-base ${error ? 'text-red-500' : 'primary_text_color'} capitalize`}>{label}</span>

            <div className="flex flex-wrap gap-4">

                {selectAllOption && (
                    <div key={'all'} onClick={onSelect.bind(null, 'all')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${value.length === members.length ? `user_avatar_blue_text user_avatar_blue_border user_avatar_blue_bg` : 'user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                        <div className="">
                            <User className="size-5" />
                        </div>

                        <span className="text-base">همه</span>
                    </div>
                )}

                {members.map(member => (
                    <div key={member.id} onClick={onSelect.bind(null, member.id)} className={`px-4 py-2 flex flex-row gap-x-4 items-center border ${disalllows.includes(member.id) ? 'border-gray-300 text-gray-300 dark:text-gray-800 dark:border-gray-800 cursor-not-allowed' : (typeof value === 'string' ? member.id === value : value.includes(member.id)) ? `cursor-pointer user_avatar_${member.scheme}_text user_avatar_${member.scheme}_border user_avatar_${member.scheme}_bg` : 'cursor-pointer user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                        <div className="">
                            <User className="size-5" />
                        </div>

                        <span className="text-base">{member.name}</span>
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

export default MemberSelector;