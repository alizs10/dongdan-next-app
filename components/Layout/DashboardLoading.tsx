import { Hourglass } from "lucide-react";

function DashboardLoading() {
    return (
        <div className="min-h-[470px] lg:min-h-[670px] flex justify-center items-center">
            <div>
                <Hourglass className="size-6 md:size-14 animate-spin primary_text_color" />
            </div>
        </div>
    );
}

export default DashboardLoading;