import { Person } from "@/types/event-types";
import Member from "./Member";

function GroupMembers({ group }: { group: Person[] }) {

    return (
        <ul className="flex flex-col gap-y-4">

            {group.map(person => (<Member key={person.id} person={person} />))}

        </ul>
    );
}

export default GroupMembers;