import Events from "@/components/Dashboard/Events/Events";
import { cookies } from "next/headers";


async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    let data = await response.json();
    return data.events;
}

async function DashboardPage() {

    let events = await getData();

    return (
        <div className="events">
            <Events items={events} />
        </div>
    );
}

export default DashboardPage;