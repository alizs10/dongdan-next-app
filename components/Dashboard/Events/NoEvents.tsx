import Button from "@/components/Common/Button";
import { Calendar, CalendarPlus } from "lucide-react";

function NoEvents({ openNewEventModal }: { openNewEventModal: () => void }) {
    return (
        <div className="flex flex-col justify-center items-center gap-y-4 w-full h-full min-h-[400px] lg:min-h-[600px]">
            <Calendar className="size-14 md:size-44 lg:size-64 text-gray-300 dark:text-gray-700" />
            <h1 className="text-base text-gray-500 lg:text-xl">اولین رویدادت رو ثبت کن</h1>
            <Button
                text="افزودن رویداد"
                color="accent"
                onClick={openNewEventModal}
                size="medium"
                icon={<CalendarPlus className="size-5" />}
            />
        </div>
    );
}

export default NoEvents;