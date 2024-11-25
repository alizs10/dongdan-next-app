'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { personSchema } from "@/database/validations/person-validation";
import { useEventStore } from "@/store/event-store";
import { Person, SchemeType } from "@/types/event-types";
import Button from "@/components/Common/Button";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";

type FormInputs = {
    name: string;
    scheme: SchemeType;
    eventId: string;
}

function EditPersonModal({ onClose, person }: { onClose: () => void, person: Person }) {

    const addToast = useToastStore(state => state.addToast)
    const updatePerson = useEventStore(state => state.updatePerson);
    const { pending, data, method, action } = useFormStatus();
    const { event_id } = useParams()

    const initInputs: FormInputs = {
        name: person.name,
        scheme: person.scheme,
        eventId: typeof event_id === 'string' ? event_id : '',
    }
    const [inputs, setInputs] = useState(initInputs);


    const initFormErrors = {
        name: '',
        scheme: '',
        eventId: '',
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);

    function selectSchemeHandler(scheme: SchemeType) {
        setInputs(prev => ({ ...prev, scheme }))
    }

    function formActionHandler(formData: FormData) {

        if (typeof event_id !== 'string') return;

        let updatedPerson = {
            ...person,
            ...inputs
        }

        let { hasError, errors } = zValidate(personSchema, updatedPerson);

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
            message: 'شخص ویرایش شد',
            type: 'success'
        }

        updatePerson(event_id, person.id, updatedPerson);
        addToast(newToast)
        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="افزودن شخص" onClose={onClose} />

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

export default EditPersonModal;