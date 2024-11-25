'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Save } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { generateUID } from "@/helpers/helpers";
import { SchemeType } from "@/types/event-types";
import { useContactStore } from "@/store/contact-store";
import { contactSchema } from "@/database/validations/contact-validation";
import { Toast, useToastStore } from "@/store/toast-store";
import { Contact } from "@/types/contact-types";
import Button from "@/components/Common/Button";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";

type FormInputs = {
    name: string;
    scheme: SchemeType;
}

function NewContactModal({ onClose }: { onClose: () => void }) {

    const addContact = useContactStore(state => state.addContact);
    const addToast = useToastStore(state => state.addToast)
    const { pending, data, method, action } = useFormStatus();

    const initInputs: FormInputs = {
        name: '',
        scheme: 'gray',
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

    function formActionHandler(formData: FormData) {

        let newContact: Contact = {
            id: generateUID(),
            ...inputs,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        }

        let { hasError, errors } = zValidate(contactSchema, newContact);

        if (hasError) {

            let validationToast: Toast = {
                id: generateUID(),
                message: `فرم نامعتبر است.`,
                type: 'danger',
            }

            addToast(validationToast);

            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);


        let newToast: Toast = {
            id: generateUID(),
            message: 'شخص جدید اضافه شد',
            type: 'success'
        }

        addContact(newContact);
        addToast(newToast)

        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="افزودن دوست" onClose={onClose} />

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
                                text={pending ? 'در حال ثبت' : 'ثبت'}
                                icon={<Save className="size-4" />}
                                onClick={() => { }}
                                size="medium"
                                color="accent"
                                type="submit"
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

export default NewContactModal;