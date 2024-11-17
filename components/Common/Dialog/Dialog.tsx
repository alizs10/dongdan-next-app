import { useDialogStore } from "@/store/dialog-store";
import { createPortal } from "react-dom";
import Button from "../Button";
import { Check, X } from "lucide-react";
import useClickOutside from "@/hooks/useOutsideClick";

function Dialog() {

    const { title, desc, okText, onOk, cancelText, onCancel, closeDialog } = useDialogStore(state => state)

    function handleOkClick() {
        onOk()
        closeDialog()
    }

    function handleCancelClick() {
        onCancel()
        closeDialog()
    }

    const dialogRef = useClickOutside(closeDialog)

    return createPortal(
        <div ref={dialogRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 md:w-1/2 lg:w-1/3 p-5 rounded-2xl flex flex-col gap-y-3 z-[999] bg-gray-100 border border-gray-300 shadow-md">
            <h1 className="text-lg font-bold text-gray-700">{title}</h1>
            <p className="text-base text-gray-500">{desc}</p>


            <div className="w-full flex flex-wrap justify-end gap-x-2 pt-2 border-gray-400 mr-auto">
                <Button
                    text={cancelText}
                    size="small"
                    onClick={handleCancelClick}
                    color="gray"
                    icon={<X className="size-4" />}
                />
                <Button
                    text={okText}
                    size="small"
                    onClick={handleOkClick}
                    color="accent"
                    icon={<Check className="size-4" />}
                />
            </div>
        </div>
        , document.getElementById('dialog-portal')!);
}

export default Dialog;