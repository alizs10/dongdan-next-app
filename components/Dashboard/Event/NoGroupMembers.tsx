import { Event } from "@/types/event-types";
import { User } from "lucide-react";

function NoGroupMembers({ eventStatus }: { eventStatus: Event['status'] }) {

    return (
        <div className="flex w-full py-5 justify-center items-center flex-col gap-y-4">
            <User className="size-14 text-gray-300" />
            <span className="text-sm text-gray-500">
                {eventStatus === 'active' ? "اولین عضو گروه رو وارد کن" : "گروه عضوی ندارد"}
            </span>
        </div>
    );
}

export default NoGroupMembers;