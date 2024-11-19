import { Trash } from "lucide-react";

function NoEventsTrashed() {
    return (
        <div className="w-full h-full flex flex-col gap-y-4 py-10 items-center justify-center  min-h-[600px]">
            <Trash className="text-gray-300 size-64" />
            <h1 className="text-gray-500 text-xl">رویدادی در سطل زباله وجود ندارد</h1>
        </div>
    );
}

export default NoEventsTrashed;