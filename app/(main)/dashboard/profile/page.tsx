import Profile from "@/components/Dashboard/Profile/Profile";
import { cookies } from "next/headers";

async function getData() {
    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token?.value}`
        }
    });

    const data = await response.json();
    return data.profile;
}

async function ProfilePage() {

    const profile = await getData();

    return (
        <Profile data={profile} />
    );
}

export default ProfilePage;