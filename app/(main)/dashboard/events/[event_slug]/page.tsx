import Event from "@/components/Dashboard/Event/Event";
import { EventContextProvider } from "@/context/EventContext";
import { MultiSelectItemContextProvider } from "@/context/MultiSelectItemContext";
import { GetEventResponse } from "@/types/responses/event";
import { cookies } from "next/headers";

async function getData(slug: string) {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${slug}`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    const data = await response.json();
    return data.data;
}


async function EventPage({ params }: { params: Promise<{ event_slug: string }> }) {

    const { event_slug } = await params;
    const data: GetEventResponse = await getData(event_slug);

    console.log(data)

    return (
        <EventContextProvider data={data}>
            <MultiSelectItemContextProvider>
                <Event />
            </MultiSelectItemContextProvider>
        </EventContextProvider>

    );
}

export default EventPage;