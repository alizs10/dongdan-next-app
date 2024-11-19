import { Trash } from "lucide-react";

function NoContactsTrashed() {
    return (
        <div className="w-full h-full flex flex-col gap-y-4 py-10 items-center justify-center  min-h-[600px]">
            <Trash className="text-gray-300 size-64" />
            <h1 className="text-gray-500 text-xl">شخصی در سطل زباله وجود ندارد</h1>
        </div>
    );
}

export default NoContactsTrashed;