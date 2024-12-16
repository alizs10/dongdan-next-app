import { CalendarPlus } from "lucide-react";
import NewEventModal from "./NewEventModal";
import { useEffect, useState } from "react";
import { useEventStore } from "@/store/event-store";
import NoEvents from "./NoEvents";
import Button from "@/components/Common/Button";
import EventsList from "./EventsList";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import DashboardLoading from "@/components/Layout/DashboardLoading";

function Events() {

    const [loading, setLoading] = useState(false);
    const { events, setEvents } = useEventStore((state) => state);
    const addToast = useToastStore(state => state.addToast);

    useEffect(() => {

        async function getEvents() {
            setLoading(true)
            try {
                let res = await fetch("http://localhost:8000/api/events", {
                    method: "GET",
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                let data = await res.json()

                if (data?.status) {
                    setEvents(data.events)
                } else {
                    let errorToast: Toast = {
                        id: generateUID(),
                        message: "دریافت اطلاعات با خطا مواجه شد",
                        type: "danger"
                    }
                    addToast(errorToast)
                }
                setLoading(false)

            } catch (error) {
                console.log(error)
                let errorToast: Toast = {
                    id: generateUID(),
                    message: "دریافت اطلاعات با خطا مواجه شد",
                    type: "danger"
                }
                addToast(errorToast)
                setLoading(false)
            }
        }

        console.log(events)

        if (!events) {
            getEvents()
        }

    }, [events])



    const [newEventModalVis, setNewEventModalVis] = useState(false);

    function openModal() {
        setNewEventModalVis(true)
    }

    function closeModal() {
        setNewEventModalVis(false)
    }

    if (loading || !events) {
        return <DashboardLoading />
    }

    return (
        <div className='events_container'>
            <div className='events_header_container'>
                <h1 className='events_header_title'>رویداد ها {`(${events.length})`}</h1>
                <Button
                    text="افزودن رویداد"
                    color="accent"
                    onClick={openModal}
                    size="medium"
                    icon={<CalendarPlus className="size-5" />}
                />
            </div>


            {events.length > 0 ? (
                <EventsList events={events} />
            ) : (
                <NoEvents openNewEventModal={openModal} />
            )}

            {newEventModalVis && <NewEventModal onClose={closeModal} />}
        </div>
    );
}

export default Events;