import TrashedEvents from "@/components/Dashboard/Events/Trashed/TrashedEvents";
import { MultiSelectItemContextProvider } from "@/context/MultiSelectItemContext";
import { TrashedEventsContextProvider } from "@/context/TrashedEventsContext";
import { cookies } from "next/headers";

async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/trashed`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    const data = await response.json();
    return data.trashed_events;
}

async function TrashedEventsPage() {

    const trashedEvents = await getData();

    return (
        <TrashedEventsContextProvider items={trashedEvents}>
            <MultiSelectItemContextProvider>
                <TrashedEvents />
            </MultiSelectItemContextProvider>
        </TrashedEventsContextProvider>
    );
}

export default TrashedEventsPage;