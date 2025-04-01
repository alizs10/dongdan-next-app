import TrashedContacts from "@/components/Dashboard/Contacts/Trashed/TrashedContacts";
import { MultiSelectItemContextProvider } from "@/context/MultiSelectItemContext";
import { TrashedContactsContextProvider } from "@/context/TrashedContactsContext";
import { cookies } from "next/headers";

async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/trashed`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    const data = await response.json();
    return data.trashed_contacts;
}

async function TrashedContactsPage() {

    const trashedContacts = await getData();

    return (
        <TrashedContactsContextProvider items={trashedContacts}>
            <MultiSelectItemContextProvider>
                <TrashedContacts />
            </MultiSelectItemContextProvider>
        </TrashedContactsContextProvider>
    );
}

export default TrashedContactsPage;