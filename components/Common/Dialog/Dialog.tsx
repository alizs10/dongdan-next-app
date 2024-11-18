import { useDialogStore } from "@/store/dialog-store";
import { createPortal } from "react-dom";
import Button from "../Button";
import { Check, X } from "lucide-react";
import useClickOutside from "@/hooks/useOutsideClick";
import ModalWrapper from "../ModalWrapper";

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

    return createPortal(
        <ModalWrapper onClose={closeDialog}>
            <div onClick={e => e.stopPropagation()} className="w-4/5 md:w-1/2 lg:w-1/3 p-5 rounded-2xl flex flex-col gap-y-3 bg-white shadow-md">
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
        </ModalWrapper>
        , document.getElementById('dialog-portal')!);
}

export default Dialog;