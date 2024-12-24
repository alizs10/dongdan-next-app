'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Pencil } from "lucide-react";
import { useContext, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { newContactSchema } from "@/database/validations/contact-validation";
import { SchemeType } from "@/types/event-types";
import Button from "@/components/Common/Button";
import { Contact } from "@/types/contact-types";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";
import { updateContactReq } from "@/app/actions/contacts";
import { ContactsContext } from "@/context/ContactsContext";

type FormInputs = {
    name: string;
    scheme: SchemeType;
}

function EditContactModal({ onClose, contact }: { onClose: () => void, contact: Contact }) {

    const addToast = useToastStore(state => state.addToast);
    const { updateContact } = useContext(ContactsContext)
    const { pending } = useFormStatus();

    const initInputs: FormInputs = {
        name: contact.name,
        scheme: contact.scheme,
    }
    const [inputs, setInputs] = useState(initInputs);


    const initFormErrors = {
        name: '',
        scheme: '',
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);

    function selectSchemeHandler(scheme: SchemeType) {
        setInputs(prev => ({ ...prev, scheme }))
    }

    async function formActionHandler() {

        const { hasError, errors } = zValidate(newContactSchema, inputs);

        if (hasError) {

            const validationToast = {

                message: `فرم نامعتبر است.`,
                type: 'danger' as const,
            }

            addToast(validationToast);

            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);

        const res = await updateContactReq(contact.id, inputs);

        if (res.success) {
            updateContact(contact.id, res.updatedContact);
            const successToast = {

                message: res.message,
                type: 'success' as const,
            }
            addToast(successToast)
            onClose();
            return
        }

        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)

    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="ویرایش شخص" onClose={onClose} />

                    <form action={formActionHandler} className="">

                        <div className="p-5 flex flex-col gap-y-4">

                            <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام شخص" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                            <AvatarSelector
                                error={formErrors.scheme}
                                value={inputs.scheme}
                                onSelect={selectSchemeHandler}
                            />

                        </div>
                        <div className="p-5 flex justify-end">
                            <Button
                                disabled={pending}
                                text={pending ? 'در حال ویرایش' : 'ویرایش'}
                                type="submit"
                                icon={<Pencil className="size-4" />}
                                color="warning"
                                size="small"
                            />
                        </div>
                    </form>

                </section>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default EditContactModal;