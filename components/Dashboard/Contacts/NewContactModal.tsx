'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Ban, Check, Save, User } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { SCHEMES } from "@/database/data/schemes";
import { generateUID } from "@/helpers/helpers";
import { SchemeType } from "@/types/event-types";
import { useContactStore } from "@/store/contact-store";
import { contactSchema } from "@/database/validations/contact-validation";
import { Toast, useToastStore } from "@/store/toast-store";
import { Contact } from "@/types/contact-types";

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

    function isSchemeSelected(scheme: SchemeType) {
        return inputs.scheme === scheme;
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

                <section onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl">
                    <ModalHeader title="افزودن دوست" onClose={onClose} />

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
                            <button disabled={pending} type="submit" className="hover:bg-indigo-100 flex gap-x-2 items-center transition-all duration-300 rounded-xl text-indigo-900 text-base px-4 py-2">
                                <span>{pending ? 'در حال ثبت' : 'ثبت'}</span>
                                <Save className="size-4" />
                            </button>
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