'use client'

import PDatePicker from "@/components/Common/Form/PDatePicker";
import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { eventSchema } from "@/database/validations/event-validation";
import { generateUID } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { useEventStore } from "@/store/event-store";
import { Ban, BriefcaseBusiness, Cake, Coffee, Plane, Save, TreePalm, Utensils } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";

type FormInputs = {
    name: string;
    label: string;
    date: Date;
}

function NewEventModal({ onClose }: { onClose: () => void }) {

    const { event_id } = useParams()
    const addEvent = useEventStore(state => state.addEvent);

    const { pending, data, method, action } = useFormStatus();
    const initInputs = {
        name: '',
        label: '',
        date: new Date(Date.now())
    }
    const [inputs, setInputs] = useState<FormInputs>(initInputs);

    const initFormErrors = {
        name: '',
        label: '',
        date: ''
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);

    function selectLabelHandler(label: string) {
        setInputs(prev => ({ ...prev, label }))
    }

    function isLabelSelected(label: string) {
        return inputs.label === label;
    }

    function formActionHandler(formData: FormData) {

        let { hasError, errors } = zValidate(eventSchema, inputs);

        if (hasError) {
            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);
        let newEvent = {
            id: generateUID(),
            group: [],
            expenses: [],
            ...inputs,
        }

        addEvent(newEvent);
        onClose();
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <form action={formActionHandler} onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl">
                    <ModalHeader title="ثبت رویداد" onClose={onClose} />

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
                    </div>


                    <div className="p-5 flex justify-end">
                        <button disabled={pending} type="submit" className="hover:bg-indigo-100 flex gap-x-2 items-center transition-all duration-300 rounded-xl text-indigo-900 text-base px-4 py-2">
                            <span>{pending ? 'در حال ثبت' : 'ثبت'}</span>
                            <Save className="size-4" />
                        </button>
                    </div>

                </form>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default NewEventModal;