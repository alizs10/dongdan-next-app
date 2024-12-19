import Contacts from "@/components/Dashboard/Contacts/Contacts";
import { cookies } from "next/headers";

async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    let data = await response.json();
    return data.contacts;
}

async function ContactsPage() {

    let contacts = await getData();
    return (
        <Contacts items={contacts} />
    );
}

export default ContactsPage;