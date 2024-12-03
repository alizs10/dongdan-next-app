import { redirect } from "next/navigation";

function DashboardPage() {
    redirect('/dashboard/events')
}

export default DashboardPage;