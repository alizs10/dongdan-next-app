'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Ban, Pencil } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { SchemeType } from "@/types/event-types";
import Button from "@/components/Common/Button";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import { updateProfileSchema } from "@/database/validations/profile-validation";
import { useAppStore } from "@/store/app-store";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";
import { User } from "@/types/user-types";

type FormInputs = {
    name: string;
    email: string,
    scheme: SchemeType;
}

function EditProfileModal({ onClose, profile }: { onClose: () => void, profile: User }) {

    const [loading, setLoading] = useState(false);
    const addToast = useToastStore(state => state.addToast);
    const updateUser = useAppStore(state => state.updateUser);

    const { pending } = useFormStatus();

    const initInputs: FormInputs = {
        name: profile.name ?? '',
        email: profile.email ?? '',
        scheme: profile.scheme ?? 'gray',
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

    async function formActionHandler() {

        if (loading) return
        setLoading(true)

        const { hasError, errors } = zValidate(updateProfileSchema, inputs);

        if (hasError) {
            setFormErrors(errors);
            return;
        }
        setFormErrors(initFormErrors);

        const updatedProfile = {
            ...profile,
            ...inputs
        }

        try {

            const res = await fetch('/api/profile', {
                method: 'PUT',
                body: JSON.stringify(updatedProfile)
            })


            const data = await res.json();
            if (data.status) {
                const successToast = {

                    message: 'پروفایل ویرایش شد',
                    type: 'success' as const,
                }
                updateUser(data?.profile ?? {});
                setLoading(false)
                addToast(successToast)
                onClose();
            } else {
                const errorToast = {

                    message: data?.message ?? 'خطا در ویرایش پروفایل',
                    type: 'danger' as const,
                }
                setLoading(false)
                addToast(errorToast)
            }

        } catch {
            const errorToast = {

                message: 'خطا',
                type: 'danger' as const,
            }
            setLoading(false)
            addToast(errorToast)
        }

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

                            <AvatarSelector
                                error={formErrors.scheme}
                                value={inputs.scheme}
                                onSelect={selectSchemeHandler}
                            />


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