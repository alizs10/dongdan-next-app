import { SCHEMES } from "@/database/data/schemes";
import { SchemeType } from "@/types/event-types";
import { Ban, Check, User } from "lucide-react";

type PropsTypes = {
    error?: string;
    value: string;
    onSelect: (scheme: SchemeType) => void;
}

function AvatarSelector({ error, value, onSelect }: PropsTypes) {
    return (
        <div className="flex flex-col gap-y-2">
            <span className={`text-base ${error ? 'text-red-500' : 'primary_text_color'} capitalize`}>انتخاب آواتار</span>

            <div className="flex flex-wrap gap-2">
                {SCHEMES.map(scheme => (<div key={scheme} onClick={() => onSelect(scheme)} className={`user_avatar_${scheme}_bg user_avatar_${scheme}_border user_avatar_${scheme}_text rounded-full cursor-pointer shadow-sm flex gap-x-4 items-center p-3 border  transition-all duration-300`}>
                    {scheme === value ? (<Check className="size-6" />) : (<User className="size-6" />)}
                </div>))}
            </div>
            {error && (
                <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                    <Ban className="size-3.5" />
                    <span>{error}</span>
                </div>
            )}
            <input type="hidden" value={value} name="scheme" />

        </div>
    );
}

export default AvatarSelector;