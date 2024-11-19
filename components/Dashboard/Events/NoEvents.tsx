import { Calendar, CalendarPlus } from "lucide-react";

function NoEvents({ openNewEventModal }: { openNewEventModal: () => void }) {
    return (
        <div className="flex flex-col justify-center items-center gap-y-4 py-10 w-full h-full">
            <Calendar className="text-gray-300 size-44 lg:size-64" />
            <h1 className="text-base text-gray-500 lg:text-xl">اولین رویدادت رو ثبت کن</h1>
            <button onClick={openNewEventModal} className="flex flex-row items-center gap-x-2 border-indigo-100 hover:border-indigo-900 bg-indigo-100 mt-2 px-4 py-2 border rounded-xl text-base text-indigo-900 transition-all duration-300">
                <CalendarPlus className="size-5" />
                <span>افزودن رویداد</span>
            </button>
        </div>
    );
}

export default NoEvents;