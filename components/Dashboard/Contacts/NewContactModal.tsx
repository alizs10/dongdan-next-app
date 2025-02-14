'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Save } from "lucide-react";
import { useContext, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { SchemeType } from "@/types/event-types";
import { createContactSchema } from "@/database/validations/contact-validation";
import Button from "@/components/Common/Button";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";
import { createContactReq } from "@/app/actions/contacts";
import { ContactsContext } from "@/context/ContactsContext";
import useStore from "@/store/store";
import UploadImage from "@/components/Common/Form/UploadImage";

type FormInputs = {
    name: string;
    avatar: File | null;
    scheme: SchemeType;
}

function NewContactModal({ onClose }: { onClose: () => void }) {

    const { addContact } = useContext(ContactsContext);

    const { addToast } = useStore();
    const { pending } = useFormStatus();

    const initInputs: FormInputs = {
        name: '',
        avatar: null,
        scheme: 'gray',
    }
    const [inputs, setInputs] = useState(initInputs);


    const initFormErrors = {
        name: '',
        scheme: '',
    }
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);

    function selectSchemeHandler(scheme: SchemeType) {
        setInputs(prev => ({ ...prev, scheme }))
    }

    function handleChangeAvatarFile(file: File) {
        setInputs(prev => ({ ...prev, avatar: file }));
    }

    function handleDeleteSelectedAvatarFile() {
        setInputs(prev => ({ ...prev, avatar: null }));
    }


    async function formActionHandler() {

        const { hasError, errors } = zValidate(createContactSchema, inputs);

        if (hasError) {
            const validationToast = {

                message: `فرم نامعتبر است.`,
                type: 'danger' as const,
            }

            addToast(validationToast);
            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);

        const res = await createContactReq(inputs)

        if (res.success) {

            addContact(res.newContact);
            const successToast = {

                message: 'شخص جدید اضافه شد',
                type: 'success' as const,
            }

            addToast(successToast)
            onClose();
            return;
        }


        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)

    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="افزودن دوست" onClose={onClose} />

                    <form action={formActionHandler} className="">

                        <div className="p-5 flex flex-col gap-y-4">

                            <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام شخص" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />


                            <UploadImage
                                value={inputs.avatar}
                                onChange={handleChangeAvatarFile}
                                onDelete={handleDeleteSelectedAvatarFile}
                            />

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

export default NewContactModal;