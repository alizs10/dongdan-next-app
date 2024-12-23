'use client'

import { getContactsReq } from "@/app/actions/contacts";
import { getEventMembersReq, getEventNonMembersReq, updateEventReq } from "@/app/actions/events";
import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { EventsContext } from "@/context/EventsContext";
import { updateEventSchema } from "@/database/validations/event-validation";
import { generateUID } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { useAppStore } from "@/store/app-store";
import { Toast, useToastStore } from "@/store/toast-store";
import { Contact } from "@/types/contact-types";
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
    const [nonMemberContacts, setNonMemberContacts] = useState<null | Contact[]>(null)

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
            const res2 = await getEventNonMembersReq(event.id)

            if (res.success && res2.success) {

                const members = res.members.map((member: Member) => ({ ...member, id: 'member.' + member.id }))
                const nonMembers = res2.nonMembers.map((contact: Contact) => ({ ...contact, id: 'contact.' + contact.id }))

                setEventMembers(members)
                setNonMemberContacts(nonMembers)

                setInputs(prevState => ({ ...prevState, members: members.map((member: Member) => member.id) }))
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

        setInputs((prev: FormInputs) => ({ ...prev, start_date: selectedDate }))
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

        const allPossibleMembers = [...(eventMembers || []), ...(nonMemberContacts || [])]

        if (personId === 'all' && inputs.members.length === allPossibleMembers.length) {
            setInputs(prev => ({ ...prev, members: [] }))
            return
        }
        if (personId === 'all' && inputs.members.length !== allPossibleMembers.length) {



            setInputs(prev => ({ ...prev, members: allPossibleMembers.map(p => p.id) ?? [] }))
            return
        }


        if (isPersonSelected(personId)) {
            setInputs(prev => ({ ...prev, members: prev.members.filter(id => id !== personId) }))
        } else {
            setInputs(prev => ({ ...prev, members: [...prev.members, personId] }))
        }
    }


    async function formActionHandler() {

        let reqInputs: {
            name: string,
            label: string,
            start_date: Date,
            members: string[],
            contacts: string[]
        } = {
            name: inputs.name,
            label: inputs.label,
            start_date: inputs.start_date,
            members: [],
            contacts: []
        }

        inputs.members.forEach(id => {
            if (id.startsWith('member.')) {
                reqInputs.members.push(id.replace('member.', ''))
            } else {
                reqInputs.contacts.push(id.replace('contact.', ''))
            }
        })

        const { hasError, errors } = zValidate(updateEventSchema, reqInputs);


        if (hasError) {
            const validationToast: Toast = {
                id: generateUID(),
                message: `فرم نامعتبر است.`,
                type: 'danger',
            }

            addToast(validationToast);

            console.log(errors)
            setFormErrors(errors);
            return;
        }
        setFormErrors(initFormErrors);

        const res = await updateEventReq(event.id, reqInputs)

        if (res.success) {
            const successToast: Toast = {
                id: generateUID(),
                message: res.message,
                type: 'success'
            }

            updateEvent(event.id, res.updatedEvent);
            addToast(successToast)
            onClose();
            return
        }

        const errorToast: Toast = {
            id: generateUID(),
            message: res.message,
            type: 'danger'
        }
        addToast(errorToast);

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
                                members={[...(eventMembers || []), ...(nonMemberContacts || [])]}
                                onSelect={togglePerson}
                                value={inputs.members}
                                error={formErrors.members}
                                selectAllOption={true}
                                self={user ? { id: user.id.toString(), scheme: user.scheme, include: false } : undefined}
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