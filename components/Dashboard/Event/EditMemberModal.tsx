'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Info, Pencil } from "lucide-react";
import { useContext, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { Member, SchemeType } from "@/types/event-types";
import Button from "@/components/Common/Button";
import { useToastStore } from "@/store/toast-store";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";
import { EventContext } from "@/context/EventContext";
import { createMemberSchema } from "@/database/validations/member-validation";
import { updateMemberReq } from "@/app/actions/event";

type FormInputs = {
    name: string;
    scheme: SchemeType;
}

function EditMemberModal({ onClose, member }: { onClose: () => void, member: Member }) {

    const addToast = useToastStore(state => state.addToast)
    const { event, updateMember } = useContext(EventContext)

    const { pending } = useFormStatus();

    const initInputs: FormInputs = {
        name: member.name,
        scheme: member.scheme,
    }

    const [inputs, setInputs] = useState(initInputs);


    const initFormErrors = {
        name: '',
        scheme: '',
        eventId: '',
    }
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);

    function selectSchemeHandler(scheme: SchemeType) {
        setInputs(prev => ({ ...prev, scheme }))
    }

    async function formActionHandler() {

        const createMembeInputs = {
            name: inputs.name,
            scheme: inputs.scheme
        }


        const { hasError, errors } = zValidate(createMemberSchema, createMembeInputs);

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

        let res = await updateMemberReq(event.id, member.id, createMembeInputs)

        if (res.success) {
            updateMember(member.id, res.member)

            const successToast = {
                message: res.message,
                type: 'success' as const,
            }

            addToast(successToast)
            onClose();
            return
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
                    <ModalHeader title="ویرایش عضو" onClose={onClose} />

                    <form action={formActionHandler} className="">

                        <div className="p-5 flex flex-col gap-y-4">

                            <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام عضو" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                            <AvatarSelector
                                error={formErrors.scheme}
                                value={inputs.scheme}
                                onSelect={selectSchemeHandler}
                            />

                            <div className="text-gray-700 dark:text-gray-300">
                                <Info className="ml-2 mt-1.5 size-4 float-right" />
                                <span className="text-sm">تغییرات در لیست دوستان نیز اعمال خواهد شد</span>
                            </div>
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

export default EditMemberModal;