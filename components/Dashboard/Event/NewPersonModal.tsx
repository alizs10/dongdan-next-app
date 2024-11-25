'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Save } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { personSchema } from "@/database/validations/person-validation";
import { useEventStore } from "@/store/event-store";
import { generateUID } from "@/helpers/helpers";
import { SchemeType } from "@/types/event-types";
import { Toast, useToastStore } from "@/store/toast-store";
import Button from "@/components/Common/Button";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";

type FormInputs = {
    name: string;
    scheme: SchemeType;
    eventId: string;
}

function NewPersonModal({ onClose }: { onClose: () => void }) {

    const addToast = useToastStore(state => state.addToast)
    const addPerson = useEventStore(state => state.addPerson);
    const { pending, data, method, action } = useFormStatus();
    const { event_id } = useParams()

    const initInputs: FormInputs = {
        name: '',
        scheme: 'gray',
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

        let newPerson = {
            id: generateUID(),
            ...inputs
        }
        let { hasError, errors } = zValidate(personSchema, newPerson);

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
            message: 'شخص اضافه شد',
            type: 'success'
        }

        addPerson(event_id, newPerson);
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

export default NewPersonModal;