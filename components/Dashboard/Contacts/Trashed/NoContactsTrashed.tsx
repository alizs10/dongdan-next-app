import { Trash } from "lucide-react";

function NoContactsTrashed() {
    return (
        <div className="flex w-full h-full justify-center items-center flex-col gap-y-4 min-h-[400px] lg:min-h-[600px]">
            <Trash className="text-gray-300 dark:text-gray-800 size-14 md:size-44 lg:size-64" />
            <h1 className="text-gray-500 text-base">شخصی در سطل زباله وجود ندارد</h1>
        </div>
    );
}

export default NoContactsTrashed;