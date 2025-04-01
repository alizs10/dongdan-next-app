'use server'

import { fetchWithAuth } from "@/app/actions/apiFetch";
import Events from "@/components/Dashboard/Events/Events";
import { EventsContextProvider } from "@/context/EventsContext";
import { MultiSelectItemContextProvider } from "@/context/MultiSelectItemContext";
// import { fetchWithAuth } from "@/lib/api";
// import { apiFetch } from "@/lib/api";
import { Event } from "@/types/event-types";

async function getData() {

    const data = await fetchWithAuth('/events');
    return data.events;
}


async function DashboardPage() {

    const events = await getData();

    return (
        <EventsContextProvider items={events}>
            <MultiSelectItemContextProvider>
                <Events />
            </MultiSelectItemContextProvider>
        </EventsContextProvider>
    );
}

export default DashboardPage;