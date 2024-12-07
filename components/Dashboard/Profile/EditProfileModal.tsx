'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Ban, Check, Pencil, User } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { SCHEMES } from "@/database/data/schemes";
import { SchemeType } from "@/types/event-types";
import Button from "@/components/Common/Button";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import { profileSchema } from "@/database/validations/profile-validation";


type Profile = {
    name: string,
    email: string,
    scheme: SchemeType;
}

type FormInputs = {
    name: string;
    email: string,
    scheme: SchemeType;
}

function EditProfileModal({ onClose, profile }: { onClose: () => void, profile: Profile }) {

    const addToast = useToastStore(state => state.addToast);
    // const updateProfile = useProfileStore(state => state.updateProfile);
    // const updatePersonInEvents = useEventStore(state => state.updatePersonInEvents);

    const { pending, data, method, action } = useFormStatus();

    const initInputs: FormInputs = {
        name: profile.name,
        email: profile.email,
        scheme: profile.scheme,
    }
    const [inputs, setInputs] = useState(initInputs);


    const initFormErrors = {
        name: '',
        email: '',
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

        let { hasError, errors } = zValidate(profileSchema, inputs);

        if (hasError) {
            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);

        let updatedProfile = {
            ...profile,
            ...inputs
        }

        // let updatedPerson = {
        //     id: updatedProfile.id,
        //     name: updatedProfile.name,
        //     scheme: updatedProfile.scheme
        // }

        // updatePersonInEvents(updatedPerson.id, updatedPerson);
        // updateProfile(profile.id, updatedProfile);
        let newToast: Toast = {
            id: generateUID(),
            message: 'پروفایل ویرایش شد',
            type: 'success'
        }

        addToast(newToast)

        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="ویرایش پروفایل" onClose={onClose} />

                    <form action={formActionHandler} className="">

                        <div className="p-5 flex flex-col gap-y-4">

                            <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                            <TextInput name="email" value={inputs.email} error={formErrors.email} label="ایمیل" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                            <span className={`text-base ${formErrors.scheme ? 'text-red-500' : 'primary_text_color'} capitalize`}>انتخاب آواتار</span>

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

export default EditProfileModal;