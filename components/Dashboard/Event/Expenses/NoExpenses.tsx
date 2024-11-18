import Button from "@/components/Common/Button";
import { Event } from "@/types/event-types";
import { NotebookPen, ReceiptText } from "lucide-react";

function NoExpenses({ openNewExpenseModal, eventStatus }: { openNewExpenseModal: () => void, eventStatus: Event['status'] }) {
    return (
        <div className="flex w-full h-fit py-10 justify-center items-center flex-col gap-y-4 min-h-[600px]">
            <ReceiptText className="size-64 text-gray-300" />
            <span className="text-base text-gray-500">
                {eventStatus === 'active' ? "اولین هزینه رو ثبت کن" : "هزینه ای ثبت نشده است"}
            </span>

            {eventStatus === 'active' && (
                <Button
                    text="افزودن هزینه"
                    color="accent"
                    onClick={openNewExpenseModal}
                    size="medium"
                    icon={<NotebookPen className="size-5" />}
                />
            )}
        </div>
    );
}

export default NoExpenses;