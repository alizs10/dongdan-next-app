import { NotebookPen, ReceiptText } from "lucide-react";

function NoExpenses({ openNewExpenseModal }: { openNewExpenseModal: () => void }) {
    return (
        <div className="flex w-full h-full justify-center items-center flex-col gap-y-4">
            <ReceiptText className="size-64 text-gray-300" />
            <span className="text-base text-gray-500">هنوز کسی هزینه ای نکرده...</span>

            <button onClick={openNewExpenseModal} className="flex gap-x-2 items-center px-5 py-2 rounded-xl bg-indigo-50 text-indigo-900 mt-2">
                <NotebookPen className="size-5" />
                <span>افزودن هزینه</span>
            </button>
        </div>
    );
}

export default NoExpenses;