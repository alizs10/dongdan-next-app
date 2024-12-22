import TrashedEvents from "@/components/Dashboard/Events/Trashed/TrashedEvents";
import { TrashedEventsContextProvider } from "@/context/TrashedEventsContext";
import { cookies } from "next/headers";

async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/trashed`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    let data = await response.json();
    return data.trashed_events;
}

async function TrashedEventsPage() {

    let trashedEvents = await getData();

    return (
        <TrashedEventsContextProvider items={trashedEvents}>
            <TrashedEvents />
        </TrashedEventsContextProvider>
    );
}

export default TrashedEventsPage;