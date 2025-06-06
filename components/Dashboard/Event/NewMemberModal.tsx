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
import UploadImage from "@/components/Common/Form/UploadImage";
import ToggleInput from "@/components/Common/Form/ToggleInput";

type FormInputs = {
    name: string;
    scheme: SchemeType;
    avatar: File | null;
    contacts: string[];
    selfIncluded: boolean;
    add_to_contacts: boolean;
}

function NewMemberModal({ onClose }: { onClose: () => void }) {

    const { user, addToast } = useStore()
    const { event, addMember, setMembers } = useContext(EventContext)
    const [fetchingNonMembers, setFetchingNonMembers] = useState(true);
    const [nonMembers, setNonMembers] = useState<null | Member[]>(null)
    const [isSelfMember, setIsSelfMember] = useState(false);

    const initInputs: FormInputs = {
        name: '',
        scheme: 'gray',
        avatar: null,
        contacts: [],
        selfIncluded: false,
        add_to_contacts: false
    }

    const [inputs, setInputs] = useState<FormInputs>(initInputs);


    const initFormErrors = {
        name: '',
        scheme: '',
        eventId: '',
        contacts: '',
        avatar: '',
        add_to_contacts: '',
    }
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);



    useEffect(() => {

        async function getNonMembers() {
            const res = await getEventNonMembersReq(event.id.toString())
            if (res.success) {
                setNonMembers(res.nonMembers)
                setIsSelfMember(res.selfIncluded)
                setInputs(prev => ({ ...prev, selfIncluded: res.selfIncluded }))
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

        if (e.target.name === 'add_to_contacts') {
            setInputs(prev => ({ ...prev, add_to_contacts: !prev.add_to_contacts }))
            return
        }

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



    function handleChangeAvatarFile(file: File) {
        setInputs(prev => ({ ...prev, avatar: file }));
    }

    function handleDeleteSelectedAvatarFile() {
        setInputs(prev => ({ ...prev, avatar: null }));
    }



    async function formActionHandler() {


        const reqInputs: CreateMemberRequest = inputsDisallowed ? {
            contacts: inputs.contacts,
            self_included: inputs.selfIncluded ? 'true' : 'false'
        } : {
            name: inputs.name,
            scheme: inputs.scheme,
            avatar: inputs.avatar,
            add_to_contacts: inputs.add_to_contacts
        }


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

                            <UploadImage
                                disabled={inputsDisallowed}
                                value={inputs.avatar}
                                onChange={handleChangeAvatarFile}
                                onDelete={handleDeleteSelectedAvatarFile}
                            />

                            <ToggleInput
                                label="افزودن به لیست دوستان"
                                name="add_to_contacts"
                                value={inputs.add_to_contacts}
                                handleChange={onInputChange}
                            />

                            <AvatarSelector
                                error={formErrors.scheme}
                                value={inputs.scheme}
                                onSelect={selectSchemeHandler}
                                disabled={inputsDisallowed}
                            />


                            {(nonMembers && user && (nonMembers.length > 0 || !isSelfMember)) && (
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
                                        include: !isSelfMember,
                                        value: inputs.selfIncluded
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