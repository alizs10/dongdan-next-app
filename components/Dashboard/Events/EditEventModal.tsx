'use client'

import { getEventMembersReq } from "@/app/actions/events";
import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { EventsContext } from "@/context/EventsContext";
import { generateUID } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { useAppStore } from "@/store/app-store";
import { Toast, useToastStore } from "@/store/toast-store";
import { Event, Member } from "@/types/event-types";
import { Ban, BriefcaseBusiness, Cake, Coffee, Loader, Pencil, Plane, TreePalm, Utensils } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { DateObject } from "react-multi-date-picker";

type FormInputs = {
    name: string;
    label: string;
    start_date: Date;
    members: string[];
}

function EditEventModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const user = useAppStore(state => state.user)
    const { updateEvent } = useContext(EventsContext)

    console.log("user info: ", user)

    const addToast = useToastStore(state => state.addToast)

    const [fetchingEventMembers, setFetchingEventMembers] = useState(true);
    const [eventMembers, setEventMembers] = useState<null | Member[]>(null)
    const initInputs = {
        name: event.name,
        label: event.label,
        start_date: new Date(event.start_date),
        members: [],
    }
    const [inputs, setInputs] = useState<FormInputs>(initInputs);

    const initFormErrors = {
        name: '',
        label: '',
        start_date: '',
        members: '',
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);


    useEffect(() => {
        async function getEventMembers() {
            const res = await getEventMembersReq(event.id)

            if (res.success) {
                setEventMembers(res.members)
                setInputs(prevState => ({ ...prevState, members: res.members.map((member: Member) => member.id) }))
                setFetchingEventMembers(false);
                return;
            }

            const errorToast: Toast = {
                id: generateUID(),
                message: 'خطا در دریافت اعضای این رویداد',
                type: 'danger'
            }
            addToast(errorToast);
        }

        getEventMembers()
    }, [])


    const { pending } = useFormStatus();



    function handleChangeDate(date: DateObject) {

        const selectedDate = new Date(date.toDate());
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

        if (personId === 'all' && inputs.members.length === eventMembers?.length) {
            setInputs(prev => ({ ...prev, members: [] }))
            return
        }
        if (personId === 'all' && inputs.members.length !== eventMembers?.length) {
            setInputs(prev => ({ ...prev, members: eventMembers?.map(p => p.id) ?? [] }))
            return
        }


        if (isPersonSelected(personId)) {
            setInputs(prev => ({ ...prev, members: prev.members.filter(id => id !== personId) }))
        } else {
            setInputs(prev => ({ ...prev, members: [...prev.members, personId] }))
        }
    }


    function formActionHandler() {



        // const { hasError, errors } = zValidate(eventSchema, updatedEvent);


        // if (hasError) {
        //     const validationToast: Toast = {
        //         id: generateUID(),
        //         message: `فرم نامعتبر است.`,
        //         type: 'danger',
        //     }

        //     addToast(validationToast);

        //     console.log(errors)
        //     setFormErrors(errors);
        //     return;
        // }



        // setFormErrors(initFormErrors);

        // const newToast: Toast = {
        //     id: generateUID(),
        //     message: 'رویداد ویرایش شد',
        //     type: 'success'
        // }

        // updateEvent(event.id, updatedEvent);
        // addToast(newToast)
        // onClose();
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
                            value={inputs.start_date}
                            error={formErrors.start_date}
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
                        {eventMembers && eventMembers.length > 0 && (
                            <MemberSelector
                                label="اعضای رویداد"
                                members={eventMembers}
                                onSelect={togglePerson}
                                value={inputs.members}
                                error={formErrors.members}
                                selectAllOption={true}
                                selfId={user?.id.toString()}
                            />
                        )}
                        {fetchingEventMembers && (
                            <div className="text-gray-500 dark:text-gray-400 py-4 flex flex-row gap-x-2 items-center justify-center">
                                <Loader className="size-5" />
                                <span className="text-sm">در حال دریافت اطلاعات...</span>
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