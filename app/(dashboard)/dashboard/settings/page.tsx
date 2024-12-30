import Settings from "@/components/Dashboard/Settings/Settings";
import { cookies } from "next/headers";


async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/settings`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    const data = await response.json();
    return data.settings;
}


async function SettingsPage() {

    const settings = await getData();

    return (
        <Settings data={settings} />
    );
}

export default SettingsPage;