import Button from "@/components/Common/Button";
import { Event } from "@/types/event-types";
import { NotebookPen, ReceiptText } from "lucide-react";

function NoExpenses({ openNewExpenseModal, eventStatus, isDeleted }: { openNewExpenseModal: () => void, eventStatus: Event['status'], isDeleted: boolean }) {
    return (
        <div className="flex w-full h-full justify-center items-center flex-col gap-y-4">
            <ReceiptText className="size-14 md:size-44 lg:size-64 text-gray-300" />
            <span className="text-base text-gray-500">
                {eventStatus === 'active' && !isDeleted ? "اولین هزینه رو ثبت کن" : "هزینه ای ثبت نشده است"}
            </span>

            {eventStatus === 'active' && !isDeleted && (
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