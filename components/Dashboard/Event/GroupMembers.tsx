import { type Member as TypeMember, Person } from "@/types/event-types";
import Member from "./Member";

function GroupMembers({ members, isEventDeleted }: { members: TypeMember[], isEventDeleted: boolean }) {

    return (
        <ul className="flex flex-col gap-y-4">

            {members.map(member => (<Member key={member.id} member={member} isEventDeleted={isEventDeleted} />))}

        </ul>
    );
}

export default GroupMembers;