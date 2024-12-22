'only-server'

export async function getTrashedEvents() {

    try {
        const res = await fetch(`http://localhost:8000/api/events/trashed`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })

        const data = await res.json();

        console.log(data)

        if (data?.status) {
            return data.trashed_events;
        }

        return false;

    } catch {
        console.log(error)
        return false;
    }

} 