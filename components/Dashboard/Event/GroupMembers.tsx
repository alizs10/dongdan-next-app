import { type Member as TypeMember, Person } from "@/types/event-types";
import Member from "./Member";

function GroupMembers({ members }: { members: TypeMember[] }) {

    return (
        <ul className="flex flex-col gap-y-4">

            {members.map(member => (<Member key={member.id} member={member} />))}

        </ul>
    );
}

export default GroupMembers;