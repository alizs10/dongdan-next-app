'use client'

import { getContactsReq } from "@/app/actions/contacts";
import { createEventReq } from "@/app/actions/events";
import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { EventsContext } from "@/context/EventsContext";
import { createEventSchema } from "@/database/validations/event-validation";
import { generateUID } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { useAppStore } from "@/store/app-store";
import { Toast, useToastStore } from "@/store/toast-store";
import { Contact } from "@/types/contact-types";
import { NewEvent } from "@/types/event-types";
import { Ban, BriefcaseBusiness, Cake, Coffee, Loader, Plane, Save, TreePalm, Utensils } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { DateObject } from "react-multi-date-picker";

type FormInputs = {
    name: string;
    label: string;
    start_date: Date;
    self_included: boolean;
    members: string[];
}

function NewEventModal({ onClose }: { onClose: () => void }) {

    const user = useAppStore(state => state.user);

    const [loading, setLoading] = useState(false);
    const { addEvent } = useContext(EventsContext);

    const [fetchingContacts, setFetchingContacts] = useState(true);
    const [contacts, setContacts] = useState<null | Contact[]>(null);
    const addToast = useToastStore(state => state.addToast)

    useEffect(() => {
        async function getUserContacts() {
            const res = await getContactsReq()

            if (res.success) {
                setContacts(res.contacts)
                setFetchingContacts(false);
                return;
            }

            const errorToast = {

                message: 'خطا در دریافت دوستان',
                type: 'danger' as const,
            }
            addToast(errorToast);
        }

        getUserContacts()
    }, [])

    const { pending } = useFormStatus();
    const initInputs = {
        name: '',
        label: '',
        members: [],
        self_included: true,
        start_date: new Date(Date.now())
    }
    const [inputs, setInputs] = useState<FormInputs>(initInputs);

    const initFormErrors = {
        name: '',
        label: '',
        start_date: '',
        self_included: '',
        members: ''
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);


    function handleChangeDate(date: DateObject) {

        const selectedDate = new Date(date.toDate());
        selectedDate.setHours(0o0)
        selectedDate.setMinutes(0o0)
        selectedDate.setSeconds(0o0)
        selectedDate.setMilliseconds(1)

        setInputs((prev: FormInputs) => ({ ...prev, start_date: selectedDate }))
    }

    function selectLabelHandler(label: string) {
        setInputs(prev => ({ ...prev, label }))
    }

    function isLabelSelected(label: string) {
        return inputs.label === label;
    }

    function isMemberSelected(personId: string) {
        return inputs.members.includes(personId);
    }

    function toggleAllMembers() {
        const allPossibleMembers = contacts;

        if (allPossibleMembers === null) return

        if (inputs.members.length === allPossibleMembers.length) {
            setInputs(prev => ({ ...prev, members: [], self_included: false }))
            return
        }

        setInputs(prev => ({ ...prev, self_included: true, members: allPossibleMembers.map(p => p.id.toString()) ?? [] }))

    }

    function toggleMember(actionKey: string) {

        if (actionKey === 'all') {
            toggleAllMembers()
            return
        }

        if (actionKey === 'self') {
            setInputs(prev => ({ ...prev, self_included: !prev.self_included }))
            return
        }

        if (isMemberSelected(actionKey)) {
            setInputs(prev => ({ ...prev, members: prev.members.filter(id => id !== actionKey) }))
        } else {
            setInputs(prev => ({ ...prev, members: [...prev.members, actionKey] }))
        }
    }

    async function formActionHandler() {
        if (loading) return;

        setLoading(true);

        const eventInputs: NewEvent = {
            name: inputs.name,
            label: inputs.label,
            start_date: inputs.start_date,
            self_included: inputs.self_included ? 'true' : 'false',
            contact_members: inputs.members.map(id => id.toString())
        }

        console.log(inputs.start_date, new Date())

        const { hasError, errors } = zValidate(createEventSchema, eventInputs);

        if (hasError) {
            console.log(errors)
            const validationToast = {

                message: `فرم نامعتبر است.`,
                type: 'danger' as const,
            }
            addToast(validationToast);
            setFormErrors(errors);
            setLoading(false);
            return;
        }
        setFormErrors(initFormErrors);

        const res = await createEventReq(eventInputs);


        if (res.success) {
            addEvent(res.newEvent);

            const successToast = {

                message: res.message,
                type: 'success' as const,
            }
            addToast(successToast)
            setLoading(false);
            onClose();
            return;
        }

        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
        setLoading(false);


    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <form action={formActionHandler} onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="ثبت رویداد" onClose={onClose} />

                    <div className="p-5 flex flex-col gap-y-4">

                        <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام رویداد" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                        <PDatePicker
                            label={'تاریخ'}
                            name={"date"}
                            value={inputs.start_date}
                            error={formErrors.start_date}
                            onChange={handleChangeDate}
                            maxDate={new Date()}
                        />

                        <div className="flex flex-col gap-y-2">

                            <span className={`text-base ${formErrors.label ? 'text-red-500' : 'primary_text_color'} capitalize`}>برچسب رویداد</span>

                            <div className="flex flex-wrap gap-2">
                                <div onClick={() => selectLabelHandler('سفر')} className={`${isLabelSelected('سفر') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 dark:hover:border-indigo-600 text-gray-500 hover:primary_text_color'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">سفر</span>
                                    <Plane className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('کافه')} className={`${isLabelSelected('کافه') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 dark:hover:border-indigo-600 text-gray-500 hover:primary_text_color'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">کافه</span>
                                    <Coffee className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('رستوران')} className={`${isLabelSelected('رستوران') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 dark:hover:border-indigo-600 text-gray-500 hover:primary_text_color'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">رستوران</span>
                                    <Utensils className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('کار')} className={`${isLabelSelected('کار') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 dark:hover:border-indigo-600 text-gray-500 hover:primary_text_color'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">کار</span>
                                    <BriefcaseBusiness className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('جشن')} className={`${isLabelSelected('جشن') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 dark:hover:border-indigo-600 text-gray-500 hover:primary_text_color'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">جشن</span>
                                    <Cake className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('تفریح')} className={`${isLabelSelected('تفریح') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 dark:hover:border-indigo-600 text-gray-500 hover:primary_text_color'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">تفریح</span>
                                    <TreePalm className="size-4" />
                                </div>
                            </div>
                            {formErrors.label && (
                                <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                    <Ban className="size-3.5" />
                                    <span>{formErrors.label}</span>
                                </div>
                            )}
                            <input type="hidden" value={inputs.label} name="label" />
                        </div>

                        {contacts && contacts.length > 0 && (
                            <MemberSelector
                                label="انتخاب اعضا"
                                members={contacts}
                                onSelect={toggleMember}
                                value={inputs.members}
                                error={formErrors.members}
                                selectAllOption={true}
                                self={user ? { id: user.id.toString(), include: true, scheme: user.scheme, value: inputs.self_included } : undefined}
                            />
                        )}

                        {fetchingContacts && (
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

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default NewEventModal;