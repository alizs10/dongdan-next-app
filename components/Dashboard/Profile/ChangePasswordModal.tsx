'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import Button from "@/components/Common/Button";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import { profileSchema } from "@/database/validations/profile-validation";


type FormInputs = {
    password: string;
    newPassword: string;
    confirmNewPassword: string,
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {

    const addToast = useToastStore(state => state.addToast);
    // const updateProfile = useProfileStore(state => state.updateProfile);
    // const updatePersonInEvents = useEventStore(state => state.updatePersonInEvents);

    const { pending } = useFormStatus();

    const initInputs: FormInputs = {
        password: '',
        newPassword: '',
        confirmNewPassword: '',
    }
    const [inputs, setInputs] = useState(initInputs);


    const initFormErrors = {
        password: '',
        newPassword: '',
        confirmNewPassword: '',
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);

    function formActionHandler() {

        const { hasError, errors } = zValidate(profileSchema, inputs);

        if (hasError) {
            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);

        // const updatedProfile = {
        //     ...inputs
        // }

        // let updatedPerson = {
        //     id: updatedProfile.id,
        //     name: updatedProfile.name,
        //     scheme: updatedProfile.scheme
        // }

        // updatePersonInEvents(updatedPerson.id, updatedPerson);
        // updateProfile(profile.id, updatedProfile);
        const newToast = {

            message: 'رمز عبور با موفقیت تغییر کرد',
            type: 'success' as const,
        }

        addToast(newToast)

        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="تغییر رمز عبور" onClose={onClose} />

                    <form action={formActionHandler} className="">

                        <div className="p-5 flex flex-col gap-y-4">

                            <TextInput type="password" name="password" value={inputs.password} error={formErrors.password} label="کلمه عبور" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                            <TextInput type="password" name="newPassword" value={inputs.newPassword} error={formErrors.newPassword} label="کلمه عبور جدید" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                            <TextInput type="password" name="confirmNewPassword" value={inputs.confirmNewPassword} error={formErrors.confirmNewPassword} label="تکرار کلمه عبور جدید" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

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

export default ChangePasswordModal;