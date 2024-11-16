import Event from "@/components/Dashboard/Event/Event";

function EventPage({ params }: { params: { event_id: string } }) {
    return (
        <div>
            <Event />
        </div>
    );
}

export default EventPage;