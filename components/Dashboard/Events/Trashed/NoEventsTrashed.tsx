import { Trash } from "lucide-react";

function NoEventsTrashed() {
    return (
        <div className="w-full h-full flex flex-col gap-y-4 items-center justify-center">
            <Trash className="text-gray-300 size-14 md:size-44 lg:size-64" />
            <h1 className="text-gray-500 text-base">رویدادی در سطل زباله وجود ندارد</h1>
        </div>
    );
}

export default NoEventsTrashed;