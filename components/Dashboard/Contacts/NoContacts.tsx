import Button from "@/components/Common/Button";
import { UserPlus, Users } from "lucide-react";

function NoContacts({ openNewContactModal }: { openNewContactModal: () => void }) {
    return (
        <div className="w-full h-fit my-auto flex flex-col gap-y-4 items-center justify-center min-h-[400px] lg:min-h-[600px]">
            <Users className="text-gray-300 dark:text-gray-800 size-14 md:size-44 lg:size-64" />
            <h1 className="text-gray-500 text-base">اولین دوستت رو اضافه کن</h1>

            <Button
                text="افزودن شخص"
                color="accent"
                onClick={openNewContactModal}
                size="medium"
                icon={<UserPlus className="size-5" />}
            />
        </div>
    );
}

export default NoContacts;