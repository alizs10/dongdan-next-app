import { ReceiptText, UserPlus } from "lucide-react";

function NoGroupExpenses({ openNewPersonModal }: { openNewPersonModal: () => void }) {
    return (
        <div className="flex w-full h-full justify-center items-center flex-col gap-y-4 py-10">
            <ReceiptText className="size-64 text-gray-300" />
            <span className="text-base text-gray-500">برای شروع اولین عضو گروه رو اضافه کن</span>

            <button onClick={openNewPersonModal} className="flex gap-x-2 items-center px-5 py-2 rounded-xl bg-indigo-50 text-indigo-900 mt-2">
                <UserPlus className="size-5" />
                <span>افزودن شخص</span>
            </button>
        </div>
    );
}

export default NoGroupExpenses;