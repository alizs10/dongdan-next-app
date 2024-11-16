'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Ban, Check, Pencil, User } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { SCHEMES } from "@/database/data/schemes";
import { useParams } from "next/navigation";
import { personSchema } from "@/database/validations/person-validation";
import { useEventStore } from "@/store/event-store";
import { Person, SchemeType } from "@/types/event-types";
import Button from "@/components/Common/Button";

type FormInputs = {
    name: string;
    scheme: SchemeType;
    eventId: string;
}

function EditPersonModal({ onClose, person }: { onClose: () => void, person: Person }) {

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

    function isSchemeSelected(scheme: SchemeType) {
        return inputs.scheme === scheme;
    }

    function formActionHandler(formData: FormData) {

        if (typeof event_id !== 'string') return;
        let { hasError, errors } = zValidate(personSchema, inputs);

        if (hasError) {
            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);

        let updatedPerson = {
            ...person,
            ...inputs
        }

        updatePerson(event_id, person.id, updatedPerson);
        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl">
                    <ModalHeader title="افزودن شخص" onClose={onClose} />

                    <form action={formActionHandler} className="">

                        <div className="p-5 flex flex-col gap-y-4">

                            <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام شخص" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                            <span className={`text-base ${formErrors.scheme ? 'text-red-500' : 'text-indigo-900'} capitalize`}>انتخاب آواتار</span>

                            <div className="flex flex-wrap gap-2">
                                {SCHEMES.map(scheme => (<div key={scheme} onClick={() => selectSchemeHandler(scheme)} className={`user_avatar_${scheme}_bg user_avatar_${scheme}_border user_avatar_${scheme}_text rounded-full cursor-pointer shadow-sm flex gap-x-4 items-center p-3 border  transition-all duration-300`}>
                                    {isSchemeSelected(scheme) ? (<Check className="size-6" />) : (<User className="size-6" />)}
                                </div>))}
                            </div>


                            {formErrors.scheme && (
                                <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                    <Ban className="size-3.5" />
                                    <span>{formErrors.scheme}</span>
                                </div>
                            )}
                            <input type="hidden" value={inputs.scheme} name="scheme" />





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