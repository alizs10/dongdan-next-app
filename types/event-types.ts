export type Event = {
    id: string;
    name: string;
    date: Date;
    label: string;
    group: Person[];
}

export type Person = {
    id: string;
    name: string;
    scheme: string;
}

export type EventState = {
    events: Event[];
    addEvent: (event: Event) => void;
    addPerson: (eventId: string, person: Person) => void;
};