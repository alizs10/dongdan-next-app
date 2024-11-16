import { UserPlus, Users } from "lucide-react";

function NoContacts({ openNewContactModal }: { openNewContactModal: () => void }) {
    return (
        <div className="w-full h-full flex flex-col gap-y-4 py-20 items-center justify-center">
            <Users className="text-gray-300 size-64" />
            <h1 className="text-gray-500 text-xl">اولین دوستت رو اضافه کن</h1>
            <button onClick={openNewContactModal} className="flex mt-2 flex-row gap-x-2 items-center text-base text-indigo-900 bg-indigo-100 px-4 py-2 rounded-xl hover:border-indigo-900 border border-indigo-100 transition-all duration-300">
                <UserPlus className="size-5" />
                <span>افزودن دوست</span>
            </button>
        </div>
    );
}

export default NoContacts;