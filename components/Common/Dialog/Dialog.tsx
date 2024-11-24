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
            <div onClick={e => e.stopPropagation()} className="modal_container p-5">
                <h1 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-300">{title}</h1>
                <p className="text-base text-gray-500 dark:text-gray-400">{desc}</p>


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