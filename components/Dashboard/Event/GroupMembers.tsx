import { Person } from "@/types/event-types";
import Member from "./Member";

function GroupMembers({ group, isEventDeleted }: { group: Person[], isEventDeleted: boolean }) {

    return (
        <ul className="flex flex-col gap-y-4">

            {group.map(person => (<Member key={person.id} person={person} isEventDeleted={isEventDeleted} />))}

        </ul>
    );
}

export default GroupMembers;