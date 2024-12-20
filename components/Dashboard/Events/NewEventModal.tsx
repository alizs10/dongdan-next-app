'use client'

import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { eventSchema } from "@/database/validations/event-validation";
import { generateUID } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { useContactStore } from "@/store/contact-store";
import { useEventStore } from "@/store/event-store";
import { Toast, useToastStore } from "@/store/toast-store";
import { Event } from "@/types/event-types";
import { Ban, BriefcaseBusiness, Cake, Coffee, Plane, Save, TreePalm, User, Utensils } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { DateObject } from "react-multi-date-picker";

type FormInputs = {
    name: string;
    label: string;
    date: Date;
    members: string[];
}

function NewEventModal({ onClose }: { onClose: () => void }) {

    const [loading, setLoading] = useState(false);
    const addToast = useToastStore(state => state.addToast)
    const addEvent = useEventStore(state => state.addEvent);
    let contacts = useContactStore(state => state.contacts)
    contacts = contacts.filter(c => c.deletedAt === null);

    const { pending, data, method, action } = useFormStatus();
    const initInputs = {
        name: '',
        label: '',
        members: [],
        date: new Date(Date.now())
    }
    const [inputs, setInputs] = useState<FormInputs>(initInputs);

    const initFormErrors = {
        name: '',
        label: '',
        date: '',
        members: ''
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);


    function handleChangeDate(date: DateObject) {

        let selectedDate = new Date(date.toDate());
        selectedDate.setHours(0o0)
        selectedDate.setMinutes(0o0)
        selectedDate.setSeconds(0o0)
        selectedDate.setMilliseconds(1)

        setInputs((prev: FormInputs) => ({ ...prev, date: selectedDate }))
    }

    function selectLabelHandler(label: string) {
        setInputs(prev => ({ ...prev, label }))
    }

    function isLabelSelected(label: string) {
        return inputs.label === label;
    }

    function isPersonSelected(personId: string) {
        return inputs.members.includes(personId);
    }


    function togglePerson(personId: string) {

        if (personId === 'all' && inputs.members.length === contacts.length) {
            setInputs(prev => ({ ...prev, members: [] }))
            return
        }
        if (personId === 'all' && inputs.members.length !== contacts.length) {
            setInputs(prev => ({ ...prev, members: contacts.map(p => p.id) }))
            return
        }


        if (isPersonSelected(personId)) {
            setInputs(prev => ({ ...prev, members: prev.members.filter(id => id !== personId) }))
        } else {
            setInputs(prev => ({ ...prev, members: [...prev.members, personId] }))
        }
    }

    async function formActionHandler(formData: FormData) {
        if (loading) return;

        setLoading(true);

        // let eventId = generateUID();

        let newEvent: Event = {
            name: inputs.name,
            label: inputs.label,
            date: inputs.date,
            status: true,
            // id: eventId,
            // members: contacts.filter(c => inputs.members.includes(c.id)).map(m => ({ ...m, eventId: eventId })),
            // expenses: [],
        }

        let { hasError, errors } = zValidate(eventSchema, newEvent);

        if (hasError) {
            console.log(errors)
            let validationToast: Toast = {
                id: generateUID(),
                message: `فرم نامعتبر است.`,
                type: 'danger',
            }


            addToast(validationToast);

            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);

        try {
            let res = await fetch('/api/events', {
                method: 'POST',
                body: JSON.stringify(newEvent)
            })

            let data = await res.json();

            if (data?.status) {

                let successToast: Toast = {
                    id: generateUID(),
                    message: data?.message ?? 'رویداد با موفقیت ثبت شد',
                    type: 'success'
                }
                addToast(successToast);
                addEvent(data?.event ?? newEvent);
                setLoading(false);
                onClose();
            } else {

                if (res.status === 422) {
                    console.log(data.errors)
                    setFormErrors(data?.errors);
                }


                let errorToast: Toast = {
                    id: generateUID(),
                    message: data?.message ?? 'خطا در ثبت رویداد',
                    type: 'danger'
                }
                addToast(errorToast);
                setLoading(false);
            }

        } catch (error) {

            console.log(error)

            let errorToast: Toast = {
                id: generateUID(),
                message: 'خطا در ثبت رویداد',
                type: 'danger'
            }
            addToast(errorToast);
            setLoading(false);
        }

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
                            value={inputs.date}
                            error={formErrors.date}
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

                        {contacts.length > 0 && (
                            <MemberSelector
                                label="انتخاب اعضا از دوستان"
                                members={contacts}
                                onSelect={togglePerson}
                                value={inputs.members}
                                error={formErrors.members}
                                selectAllOption={true}
                            />
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