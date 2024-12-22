import Contacts from "@/components/Dashboard/Contacts/Contacts";
import { ContactsContextProvider } from "@/context/ContactsContext";
import { MultiSelectItemContextProvider } from "@/context/MultiSelectItemContext";
import { cookies } from "next/headers";

async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    const data = await response.json();
    return data.contacts;
}

async function ContactsPage() {

    const contacts = await getData();

    return (
        <ContactsContextProvider items={contacts}>
            <MultiSelectItemContextProvider>
                <Contacts />
            </MultiSelectItemContextProvider>
        </ContactsContextProvider>
    );
}

export default ContactsPage;