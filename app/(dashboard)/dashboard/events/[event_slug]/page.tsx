import Event from "@/components/Dashboard/Event/Event";
import { EventContextProvider } from "@/context/EventContext";
import { cookies } from "next/headers";

async function getData(slug: string) {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${slug}`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    const data = await response.json();
    return data.event;
}


async function EventPage({ params }: { params: Promise<{ event_slug: string }> }) {

    const { event_slug } = await params;
    const event = await getData(event_slug);

    return (
        <EventContextProvider eventData={event}>
            <Event />
        </EventContextProvider>

    );
}

export default EventPage;