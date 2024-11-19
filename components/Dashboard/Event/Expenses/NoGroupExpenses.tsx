import Button from "@/components/Common/Button";
import { ReceiptText, UserPlus } from "lucide-react";

function NoGroupExpenses({ openNewPersonModal }: { openNewPersonModal: () => void }) {
    return (
        <div className="flex w-full h-full justify-center items-center flex-col gap-y-4">
            <ReceiptText className="size-14 md:size-44 lg:size-64 text-gray-300" />
            <span className="text-base text-gray-500">برای شروع اولین عضو گروه رو اضافه کن</span>


            <Button
                text="افزودن شخص"
                color="accent"
                onClick={openNewPersonModal}
                size="medium"
                icon={<UserPlus className="size-5" />}
            />
        </div>
    );
}

export default NoGroupExpenses;