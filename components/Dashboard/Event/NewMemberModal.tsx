'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { File, Loader, Save, Trash, Upload } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { Member, SchemeType } from "@/types/event-types";
import Button from "@/components/Common/Button";
import AvatarSelector from "@/components/Common/Form/AvatarSelector";
import { EventContext } from "@/context/EventContext";
import { getEventNonMembersReq } from "@/app/actions/events";
import { addMembersSchema, createMemberSchema } from "@/database/validations/member-validation";
import { createMemberReq } from "@/app/actions/event";
import { CreateMemberRequest } from "@/types/requests/event";
import useStore from "@/store/store";
import NonMemberSelector from "@/components/Common/Form/NonMemberSelector";

type FormInputs = {
    name: string;
    scheme: SchemeType;
    avatar: File | null;
    contacts: string[];
    selfIncluded: boolean;
}

function NewMemberModal({ onClose }: { onClose: () => void }) {

    const { user, addToast } = useStore()
    const { event, addMember, setMembers } = useContext(EventContext)
    const [fetchingNonMembers, setFetchingNonMembers] = useState(true);
    const [nonMembers, setNonMembers] = useState<null | Member[]>(null)
    const [selfIncluded, setSelfIncluded] = useState(false);

    const initInputs: FormInputs = {
        name: '',
        scheme: 'gray',
        avatar: null,
        contacts: [],
        selfIncluded: false
    }

    const [inputs, setInputs] = useState<FormInputs>(initInputs);


    const initFormErrors = {
        name: '',
        scheme: '',
        eventId: '',
        contacts: '',
        avatar: '',
    }
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);



    useEffect(() => {

        async function getNonMembers() {
            const res = await getEventNonMembersReq(event.id.toString())
            if (res.success) {
                setNonMembers(res.nonMembers)
                setSelfIncluded(!res.selfIncluded)
                setFetchingNonMembers(false);
                return
            }


            const errorToast = {
                message: 'خطا در دریافت اعضای این رویداد',
                type: 'danger' as const,
            }
            addToast(errorToast);
        }


        getNonMembers()
    }, [])


    const { pending } = useFormStatus();

    const inputsDisallowed = (inputs.contacts.length > 0 || inputs.selfIncluded);

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (inputsDisallowed) return;
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function selectSchemeHandler(scheme: SchemeType) {
        if (inputsDisallowed) return;
        setInputs(prev => ({ ...prev, scheme }))
    }

    function isMemberSelected(personId: string) {
        return inputs.contacts.includes(personId);
    }

    function toggleAllMembers() {
        const allPossibleMembers = nonMembers;
        if (allPossibleMembers === null) return;
        if (inputs.contacts.length === allPossibleMembers.length) {
            setInputs(prev => ({ ...prev, contacts: [], selfIncluded: false }))
            return
        }

        setInputs(prev => ({ ...prev, selfIncluded: true, contacts: allPossibleMembers.map(p => p.id.toString()) ?? [] }))

    }

    function toggleMember(actionKey: string) {

        if (actionKey === 'all') {
            toggleAllMembers()
            return
        }

        if (actionKey === 'self') {
            setInputs(prev => ({ ...prev, selfIncluded: !prev.selfIncluded }))
            return
        }

        if (isMemberSelected(actionKey)) {
            setInputs(prev => ({ ...prev, contacts: prev.contacts.filter(id => id !== actionKey) }))
        } else {
            setInputs(prev => ({ ...prev, contacts: [...prev.contacts, actionKey] }))
        }
    }



    const fileRef = useRef<HTMLInputElement | null>(null)
    function handleChangeAvatarFile() {
        setInputs(prev => ({ ...prev, avatar: (fileRef && fileRef.current && fileRef.current.files && fileRef.current.files[0]) ?? null }));
    }

    function handleDeleteSelectedAvatarFile(event: React.MouseEvent) {
        event.stopPropagation();

        setInputs(prev => ({ ...prev, avatar: null }));
        if (fileRef.current) {
            fileRef.current.value = '';
        }
    }



    async function formActionHandler() {


        const reqInputs: CreateMemberRequest = inputsDisallowed ? {
            contacts: inputs.contacts,
            self_included: inputs.selfIncluded ? 'true' : 'false'
        } : {
            name: inputs.name,
            scheme: inputs.scheme
        }

        console.log(reqInputs)

        const validationSchema = inputsDisallowed ? addMembersSchema : createMemberSchema;
        const { hasError, errors } = zValidate(validationSchema, reqInputs);

        if (hasError) {
            console.log(errors)
            const validationToast = {
                message: `فرم نامعتبر است.`,
                type: 'danger' as const,
            }

            addToast(validationToast);

            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);

        const res = await createMemberReq(event.id.toString(), reqInputs);

        if (res.success) {

            const successToast = {
                message: res.message,
                type: 'success' as const,
            }

            res?.member ? addMember(res.member) : setMembers(res.members);

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
                    <ModalHeader title="افزودن عضو" onClose={onClose} />

                    <form action={formActionHandler} className="">

                        <div className="p-5 flex flex-col gap-y-4">

                            <TextInput
                                name="name"
                                value={inputs.name}
                                error={formErrors.name}
                                label="نام عضو"
                                handleChange={onInputChange}
                                disabled={inputsDisallowed}
                            />


                            <div onClick={() => {
                                if (inputsDisallowed) return;
                                fileRef.current?.click()
                            }} className={`flex flex-col gap-y-3 justify-center items-center border py-10 border-dashed app_border_color rounded-xl ${inputsDisallowed ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                <div className="flex flex-row gap-x-2 text-gray-300 dark:text-gray-600 items-center">

                                    {inputs.avatar ? <File className="size-4" /> : <Upload className="size-4" />}
                                    <span className="text-base">
                                        {inputs.avatar ? inputs.avatar.name : 'آپلود آواتار'}
                                    </span>
                                </div>

                                {inputs.avatar && (
                                    <Button
                                        text="حذف"
                                        onClick={handleDeleteSelectedAvatarFile}
                                        color="danger"
                                        icon={<Trash className="size-4" />}
                                        size="small"

                                    />
                                )}
                                <input
                                    ref={fileRef}
                                    onChange={handleChangeAvatarFile}
                                    type="file"
                                    className="hidden"
                                    name="avatar_file"
                                />
                            </div>

                            <AvatarSelector
                                error={formErrors.scheme}
                                value={inputs.scheme}
                                onSelect={selectSchemeHandler}
                                disabled={inputsDisallowed}
                            />


                            {(nonMembers && user && (nonMembers.length > 0 || selfIncluded)) && (
                                <NonMemberSelector
                                    label="اعضای رویداد"
                                    members={nonMembers}
                                    onSelect={toggleMember}
                                    value={inputs.contacts}
                                    error={formErrors.contacts}
                                    selectAllOption={true}
                                    self={{
                                        id: user.id.toString(),
                                        scheme: user.scheme,
                                        include: selfIncluded,
                                        value: !inputs.selfIncluded
                                    }}
                                />
                            )}
                            {fetchingNonMembers && (
                                <div className="text-gray-500 dark:text-gray-400 py-4 flex flex-row gap-x-2 items-center justify-center">
                                    <Loader className="size-5" />
                                    <span className="text-sm">در حال دریافت اطلاعات...</span>
                                </div>
                            )}
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

export default NewMemberModal;