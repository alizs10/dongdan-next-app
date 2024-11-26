import Event from "@/components/Dashboard/Event/Event";
import { EventContextProvider } from "@/context/EventContext";

function EventPage() {
    return (
        <EventContextProvider>
            <Event />
        </EventContextProvider>

    );
}

export default EventPage;