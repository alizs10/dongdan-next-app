'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { contactSchema } from "@/database/validations/contact-validation";
import { Person, SchemeType } from "@/types/event-types";
import Button from "@/components/Common/Button";
import { useContactStore } from "@/store/contact-store";
import { Contact } from "@/types/contact-types";
import { useEventStore } from "@/store/event-store";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";

type FormInputs = {
    name: string;
    scheme: SchemeType;
}

function EditContactModal({ onClose, contact }: { onClose: () => void, contact: Contact }) {

    const addToast = useToastStore(state => state.addToast);
    const updateContact = useContactStore(state => state.updateContact);
    const updatePersonInEvents = useEventStore(state => state.updatePersonInEvents);
    const { pending, data, method, action } = useFormStatus();

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

    function formActionHandler(formData: FormData) {

        let updatedContact: Contact = {
            ...contact,
            ...inputs
        }

        let { hasError, errors } = zValidate(contactSchema, updatedContact);

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

        let updatedPerson: Omit<Person, 'eventId'> = {
            id: updatedContact.id,
            name: updatedContact.name,
            scheme: updatedContact.scheme,
        }

        updatePersonInEvents(updatedPerson.id, updatedPerson);
        updateContact(contact.id, updatedContact);

        let newToast: Toast = {
            id: generateUID(),
            message: 'شخص ویرایش شد',
            type: 'success'
        }

        addToast(newToast)

        onClose();
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