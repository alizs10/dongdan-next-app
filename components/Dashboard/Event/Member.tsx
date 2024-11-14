import Button from "@/components/Common/Button";
import useClickOutside from "@/hooks/useOutsideClick";
import { Person } from "@/types/event-types";
import { Ellipsis, Pencil, Trash, User } from "lucide-react";
import { useState } from "react";

function Member({ person }: { person: Person }) {

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    const parentRef = useClickOutside(() => setIsOptionsOpen(false))

    return (

        <li className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-x-4 items-center">
                <div className={`p-2 border user_avatar_${person.scheme}_border user_avatar_${person.scheme}_bg rounded-full`}>
                    <User className={`size-5 user_avatar_${person.scheme}_text`} />
                </div>
                <span className={`text-base user_avatar_${person.scheme}_text`}>{person.name}</span>
            </div>

            <div ref={parentRef} className="relative">
                <Button
                    text=''
                    icon={<Ellipsis className='size-4' />}
                    color='gray'
                    size='small'
                    shape='square'
                    onClick={toggleOptions}
                />

                {isOptionsOpen && (
                    <div className="absolute z-50 top-full left-0 mt-4 flex flex-col gap-y-2">
                        <Button
                            text='ویرایش'
                            icon={<Pencil className='size-4' />}
                            color='warning'
                            size='small'
                            onClick={() => { }}
                        />
                        <Button
                            text='حذف'
                            icon={<Trash className='size-4' />}
                            color='danger'
                            size='small'
                            onClick={() => { }}
                        />
                    </div>
                )}
            </div>

        </li>

    );
}

export default Member;