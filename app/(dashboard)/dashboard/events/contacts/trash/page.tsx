import TrashedContacts from "@/components/Dashboard/Contacts/Trashed/TrashedContacts";
import { cookies } from "next/headers";

async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/trashed`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    let data = await response.json();
    return data.trashed_contacts;
}

async function TrashedContactsPage() {

    let trashedContacts = await getData();

    return (
        <TrashedContacts items={trashedContacts} />
    );
}

export default TrashedContactsPage;