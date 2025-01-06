'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { transformLaravelFieldErrors, zValidate } from "@/helpers/validation-helper";
import { LoaderCircle, UserX, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Common/Button";
import { useToastStore } from "@/store/toast-store";
import { deleteAccountSchema } from "@/database/validations/auth-validation";
import { deleteAccountReq } from "@/app/actions/profile";
import { useRouter } from "next/navigation";


type FormInputs = {
    password: string;
}

function DeleteAccountModal({ onClose }: { onClose: () => void }) {

    const addToast = useToastStore(state => state.addToast);
    const [loading, setLoading] = useState(false)

    const router = useRouter();

    const initInputs: FormInputs = {
        password: '',
    }
    const [inputs, setInputs] = useState(initInputs);

    const initFormErrors = {
        password: '',
    }
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);

    async function formActionHandler() {
        if (loading) return
        setLoading(true)

        const { hasError, errors } = zValidate(deleteAccountSchema, inputs);

        if (hasError) {

            addToast({
                message: 'اطلاعات وارد شده صحیح نیست',
                type: 'danger' as const
            })
            setFormErrors(errors);
            setLoading(false)

            return;
        }
        setFormErrors(initFormErrors);

        const res = await deleteAccountReq(inputs);

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

        setTimeout(() => {
            router.push('/');
        }, 3000)
        // onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="حذف حساب کاربری" onClose={onClose} />
                    <div>

                        <div className="p-5 flex flex-col gap-y-4">

                            <p className="app_text_color text-justify font-semibold text-base">آیا از حذف حساب کاربری خود اطمینان دارید؟ تمام داده های شما حذف خواهد شد و قابل برگشت نمی باشد.</p>

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

                        </div>
                        <div className="p-5 flex flex-row gap-x-2 items-center justify-end">
                            <Button
                                text={'انصراف'}
                                type="button"
                                icon={<X className="size-4" />}
                                onClick={onClose}
                                color="gray"
                                size="small"
                            />
                            <Button
                                disabled={loading}
                                text={loading ? 'در حال حذف حساب' : 'حذف حساب'}
                                type="button"
                                onClick={formActionHandler}
                                icon={loading ? <LoaderCircle className="size-4 animate-spin" /> : <UserX className="size-4" />}
                                color={loading ? 'gray' : 'danger'}
                                size="small"
                            />

                        </div>
                    </div>

                </section>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default DeleteAccountModal;