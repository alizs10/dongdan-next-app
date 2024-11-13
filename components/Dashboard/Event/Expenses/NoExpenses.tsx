import Button from "@/components/Common/Button";
import { NotebookPen, ReceiptText } from "lucide-react";

function NoExpenses({ openNewExpenseModal }: { openNewExpenseModal: () => void }) {
    return (
        <div className="flex w-full h-fit py-20 justify-center items-center flex-col gap-y-4">
            <ReceiptText className="size-64 text-gray-300" />
            <span className="text-base text-gray-500">هنوز کسی هزینه ای نکرده...</span>

            <Button
                text="افزودن هزینه"
                color="accent"
                onClick={openNewExpenseModal}
                size="medium"
                icon={<NotebookPen className="size-5" />}
            />
        </div>
    );
}

export default NoExpenses;