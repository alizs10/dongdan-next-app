'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { transformLaravelFieldErrors, zValidate } from "@/helpers/validation-helper";
import { Save } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Common/Button";

import { changePasswordReq } from "@/app/actions/auth";
import { changePasswordSchema } from "@/database/validations/auth-validation";
import { ChangePasswordRequest } from "@/types/requests/auth";
import useStore from "@/store/store";

function ChangePasswordModal({ onClose }: { onClose: () => void }) {

    const { addToast } = useStore();;
    const [loading, setLoading] = useState(false)

    const initInputs = {
        password: '',
        new_password: '',
        new_password_confirmation: '',
    }
    const [inputs, setInputs] = useState<ChangePasswordRequest>(initInputs);


    const initFormErrors = {
        password: '',
        new_password: '',
        new_password_confirmation: '',
    }
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);

    async function formActionHandler() {
        if (loading) return
        setLoading(true)

        const { hasError, errors } = zValidate(changePasswordSchema, inputs);

        if (hasError) {

            console.log(errors)
            addToast({
                message: 'اطلاعات وارد شده صحیح نیست',
                type: 'danger' as const
            })
            setFormErrors(errors);
            setLoading(false)

            return;
        }

        const res = await changePasswordReq(inputs);

        if (!res.success) {
            addToast({
                message: res.message,
                type: 'danger' as const
            })
            if (res?.errors) {
                setFormErrors(transformLaravelFieldErrors(res.errors));
            }
            setLoading(false)
            return;
        }

        addToast({
            message: res.message,
            type: 'success' as const
        })
        setLoading(false)
        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="تغییر رمز عبور" onClose={onClose} />

                    <form action={formActionHandler}>

                        <div className="p-5 flex flex-col gap-y-4">

                            <TextInput
                                type="password"
                                name="password"
                                value={inputs.password}
                                error={formErrors.password}
                                label="رمز عبور"
                                handleChange={e => setInputs(prev => ({
                                    ...prev, [e.target.name]: e.target.value
                                }))}
                            />

                            <TextInput
                                type="password"
                                name="new_password"
                                value={inputs.new_password}
                                error={formErrors.new_password}
                                label="رمز عبور جدید"
                                handleChange={e => setInputs(prev => ({
                                    ...prev, [e.target.name]: e.target.value
                                }))}
                            />

                            <TextInput
                                type="password"
                                name="new_password_confirmation"
                                value={inputs.new_password_confirmation}
                                error={formErrors.new_password_confirmation}
                                label="تکرار رمز عبور جدید"
                                handleChange={e => setInputs(prev => ({
                                    ...prev, [e.target.name]: e.target.value
                                }))}
                            />

                        </div>
                        <div className="p-5 flex justify-end">
                            <Button
                                disabled={loading}
                                text={loading ? 'در حال ثبت' : 'ثبت'}
                                type="submit"
                                icon={<Save className="size-4" />}
                                color="accent"
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