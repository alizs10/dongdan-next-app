import { X } from "lucide-react";

function ModalHeader({ title, onClose }: { title: string, onClose: () => void }) {

    return (
        <div className="px-2 py-2 flex items-center justify-between w-full border-b app_border_color">
            <h2 className="text-gray-700 dark:text-gray-300 text-base pr-3 py-3">{title}</h2>

            <button type="button" className="p-3 rounded-xl">
                <X className="size-5 text-gray-300 dark:text-gray-700" onClick={onClose} />
            </button>
        </div>
    );
}

export default ModalHeader;