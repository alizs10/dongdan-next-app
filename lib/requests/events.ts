'only-server'

export async function getTrashedEvents() {

    try {
        let res = await fetch(`http://localhost:8000/api/events/trashed`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })

        let data = await res.json();

        console.log(data)

        if (data?.status) {
            return data.trashed_events;
        }

        return false;

    } catch (error) {
        console.log(error)
        return false;
    }

} 