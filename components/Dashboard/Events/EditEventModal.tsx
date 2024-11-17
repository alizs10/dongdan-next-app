'use client'

import Button from "@/components/Common/Button";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { eventSchema } from "@/database/validations/event-validation";
import { zValidate } from "@/helpers/validation-helper";
import { useContactStore } from "@/store/contact-store";
import { useEventStore } from "@/store/event-store";
import { Event } from "@/types/event-types";
import { Ban, BriefcaseBusiness, Cake, Coffee, Pencil, Plane, TreePalm, User, Utensils } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";

type FormInputs = {
    name: string;
    label: string;
    date: Date;
    group: string[];
}

function EditEventModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const updateEvent = useEventStore(state => state.updateEvent);
    let contacts = useContactStore(state => state.contacts)
    contacts = contacts.filter(c => c.deletedAt === null);

    const { pending, data, method, action } = useFormStatus();

    const contactsIds = contacts.map(c => c.id)
    const eventPersonsIds = event.group.map(person => person.id)
    const initInputs = {
        name: event.name,
        label: event.label,
        date: event.date,
        group: eventPersonsIds.filter(personId => contactsIds.includes(personId)),
    }
    const [inputs, setInputs] = useState<FormInputs>(initInputs);

    const initFormErrors = {
        name: '',
        label: '',
        date: '',
        group: ''
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);

    function selectLabelHandler(label: string) {
        setInputs(prev => ({ ...prev, label }))
    }

    function isLabelSelected(label: string) {
        return inputs.label === label;
    }


    function isPersonSelected(personId: string) {
        return inputs.group.includes(personId);
    }


    function togglePerson(personId: string) {

        if (personId === 'all' && inputs.group.length === contacts.length) {
            setInputs(prev => ({ ...prev, group: [] }))
            return
        }
        if (personId === 'all' && inputs.group.length !== contacts.length) {
            setInputs(prev => ({ ...prev, group: contacts.map(p => p.id) }))
            return
        }


        if (isPersonSelected(personId)) {
            setInputs(prev => ({ ...prev, group: prev.group.filter(id => id !== personId) }))
        } else {
            setInputs(prev => ({ ...prev, group: [...prev.group, personId] }))
        }
    }


    function formActionHandler(formData: FormData) {

        let { hasError, errors } = zValidate(eventSchema, inputs);

        if (hasError) {
            console.log(errors)
            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);
        let updatedEvent = {
            ...event,
            ...inputs,
            group: contacts.filter(c => inputs.group.includes(c.id)),
        }

        updateEvent(event.id, updatedEvent);
        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <form action={formActionHandler} onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl">
                    <ModalHeader title="ویرایش رویداد" onClose={onClose} />

                    <div className="p-5 flex flex-col gap-y-4">

                        <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام رویداد" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                        <PDatePicker
                            label={'تاریخ'}
                            name={"date"}
                            value={inputs.date}
                            error={formErrors.date}
                            onChange={(date) => setInputs((prev: FormInputs) => ({ ...prev, date: date.toDate() }))}
                        />

                        <div className="flex flex-col gap-y-2">

                            <span className={`text-base ${formErrors.label ? 'text-red-500' : 'text-indigo-900'} capitalize`}>برچسب رویداد</span>

                            <div className="flex flex-wrap gap-2">
                                <div onClick={() => selectLabelHandler('سفر')} className={`${isLabelSelected('سفر') ? 'text-indigo-900 border-indigo-900' : 'border-gray-200 hover:border-indigo-900 text-gray-500 hover:text-indigo-900'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">سفر</span>
                                    <Plane className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('کافه')} className={`${isLabelSelected('کافه') ? 'text-indigo-900 border-indigo-900' : 'border-gray-200 hover:border-indigo-900 text-gray-500 hover:text-indigo-900'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">کافه</span>
                                    <Coffee className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('رستوران')} className={`${isLabelSelected('رستوران') ? 'text-indigo-900 border-indigo-900' : 'border-gray-200 hover:border-indigo-900 text-gray-500 hover:text-indigo-900'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">رستوران</span>
                                    <Utensils className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('کار')} className={`${isLabelSelected('کار') ? 'text-indigo-900 border-indigo-900' : 'border-gray-200 hover:border-indigo-900 text-gray-500 hover:text-indigo-900'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">کار</span>
                                    <BriefcaseBusiness className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('جشن')} className={`${isLabelSelected('جشن') ? 'text-indigo-900 border-indigo-900' : 'border-gray-200 hover:border-indigo-900 text-gray-500 hover:text-indigo-900'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">جشن</span>
                                    <Cake className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('تفریح')} className={`${isLabelSelected('تفریح') ? 'text-indigo-900 border-indigo-900' : 'border-gray-200 hover:border-indigo-900 text-gray-500 hover:text-indigo-900'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
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
                            <div className="flex flex-col gap-y-2">

                                <span className={`text-base ${formErrors.group ? 'text-red-500' : 'text-indigo-900'} capitalize`}>افزودن شخص از دوستان</span>

                                <div className="flex flex-wrap gap-4">

                                    <div onClick={togglePerson.bind(null, 'all')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs.group.length === contacts.length ? `user_avatar_blue_text user_avatar_blue_border user_avatar_blue_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">همه</span>
                                    </div>


                                    {contacts.map(user => (
                                        <div key={user.id} onClick={togglePerson.bind(null, user.id)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(user.id) ? `user_avatar_${user.scheme}_text user_avatar_${user.scheme}_border user_avatar_${user.scheme}_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
                                            <div className="">
                                                <User className="size-5" />
                                            </div>

                                            <span className="text-base">{user.name}</span>
                                        </div>
                                    ))}



                                </div>


                                {formErrors.group && (
                                    <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                        <Ban className="size-3.5" />
                                        <span>{formErrors.group}</span>
                                    </div>
                                )}
                                <input type="hidden" value={inputs.group.toString()} name="group" />
                            </div>
                        )}
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

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default EditEventModal;