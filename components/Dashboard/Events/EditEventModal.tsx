'use client'

import Button from "@/components/Common/Button";
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
import { Ban, BriefcaseBusiness, Cake, Coffee, Pencil, Plane, TreePalm, User, Utensils } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { DateObject } from "react-multi-date-picker";

type FormInputs = {
    name: string;
    label: string;
    date: Date;
    group: string[];
}

function EditEventModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const addToast = useToastStore(state => state.addToast)
    const { updateEvent } = useEventStore(state => state);
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

        // prev group: include contacts and not contacts
        let prevGroup = [...event.group]

        // input group: include contacts only
        let addedContactsToGroup: Event['group'] = [];
        let deletedContactsFromGroup: Event['group'] = [];
        let nonContactsOfGroup: Event['group'] = [];

        // non contacts of group
        event.group.forEach(member => {
            if (!contacts.some(c => c.id === member.id)) {
                nonContactsOfGroup.push(member)
            }
        })

        // added contacts to group
        inputs.group.forEach(pID => {
            let contact = contacts.find(c => c.id === pID);
            if (contact) {
                addedContactsToGroup.push({ id: contact.id, name: contact.name, scheme: contact.scheme, eventId: event.id })
            }
        })

        let updatedGroup: Event['group'] = [...nonContactsOfGroup, ...addedContactsToGroup];

        // deleted contacts from group
        prevGroup.forEach(member => {
            if (!updatedGroup.some(m => m.id === member.id)) {
                deletedContactsFromGroup.push(member)
            }
        })

        let updatedEvent: Event = {
            ...event,
            ...inputs,
            group: updatedGroup,
        }

        let deletedContactsFromGroupIDs = deletedContactsFromGroup.map(p => p.id);

        // delete expenses of deleted members
        let deletableExpenses: string[] = [];

        event.expenses.forEach(expense => {
            if (expense.type === 'transfer' && (deletedContactsFromGroupIDs.includes(expense.from) || deletedContactsFromGroupIDs.includes(expense.to))) {
                deletableExpenses.push(expense.id);
            } else if (expense.type === 'expend' && deletedContactsFromGroupIDs.includes(expense.payer)) {
                deletableExpenses.push(expense.id);
            } else if (expense.type === 'expend' && !deletedContactsFromGroupIDs.includes(expense.payer) && expense.group.some(p => deletedContactsFromGroupIDs.includes(p))) {
                expense.group = expense.group.filter(p => !deletedContactsFromGroupIDs.includes(p));
            }
        })

        updatedEvent.expenses = updatedEvent.expenses.filter(expense => !deletableExpenses.includes(expense.id))

        let { hasError, errors } = zValidate(eventSchema, updatedEvent);

        if (hasError) {
            let validationToast: Toast = {
                id: generateUID(),
                message: `فرم نامعتبر است.`,
                type: 'danger',
            }

            addToast(validationToast);

            console.log(errors)
            setFormErrors(errors);
            return;
        }


        console.log('deletedContactsFromGroup: ', deletedContactsFromGroup);

        setFormErrors(initFormErrors);

        let newToast: Toast = {
            id: generateUID(),
            message: 'رویداد ویرایش شد',
            type: 'success'
        }

        updateEvent(event.id, updatedEvent);
        addToast(newToast)
        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <form action={formActionHandler} onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="ویرایش رویداد" onClose={onClose} />

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
                                <div onClick={() => selectLabelHandler('سفر')} className={`${isLabelSelected('سفر') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 text-gray-500 dark:text-gray-400 hover:text-indigo-800 dark:hover:text-indigo-600'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">سفر</span>
                                    <Plane className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('کافه')} className={`${isLabelSelected('کافه') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 text-gray-500 dark:text-gray-400 hover:text-indigo-800 dark:hover:text-indigo-600'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">کافه</span>
                                    <Coffee className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('رستوران')} className={`${isLabelSelected('رستوران') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 text-gray-500 dark:text-gray-400 hover:text-indigo-800 dark:hover:text-indigo-600'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">رستوران</span>
                                    <Utensils className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('کار')} className={`${isLabelSelected('کار') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 text-gray-500 dark:text-gray-400 hover:text-indigo-800 dark:hover:text-indigo-600'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">کار</span>
                                    <BriefcaseBusiness className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('جشن')} className={`${isLabelSelected('جشن') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 text-gray-500 dark:text-gray-400 hover:text-indigo-800 dark:hover:text-indigo-600'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
                                    <span className="text-base">جشن</span>
                                    <Cake className="size-4" />
                                </div>
                                <div onClick={() => selectLabelHandler('تفریح')} className={`${isLabelSelected('تفریح') ? 'primary_text_color border-indigo-800 dark:border-indigo-600' : 'app_border_color hover:border-indigo-800 text-gray-500 dark:text-gray-400 hover:text-indigo-800 dark:hover:text-indigo-600'} rounded-xl cursor-pointer shadow-sm flex gap-x-4 items-center px-4 py-2 border  transition-all duration-300`}>
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

                                <span className={`text-base ${formErrors.group ? 'text-red-500' : 'primary_text_color'} capitalize`}>افزودن شخص از دوستان</span>

                                <div className="flex flex-wrap gap-4">

                                    <div onClick={togglePerson.bind(null, 'all')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs.group.length === contacts.length ? `user_avatar_blue_text user_avatar_blue_border user_avatar_blue_bg` : 'user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">همه</span>
                                    </div>


                                    {contacts.map(user => (
                                        <div key={user.id} onClick={togglePerson.bind(null, user.id)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(user.id) ? `user_avatar_${user.scheme}_text user_avatar_${user.scheme}_border user_avatar_${user.scheme}_bg` : 'user_avatar_gray_text app_border_color'} transition-all duration-300 rounded-full`}>
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