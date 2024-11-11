'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { eventSchema } from "@/database/validations/event-validation";
import { zValidate } from "@/helpers/validation-helper";
import { Ban, BriefcaseBusiness, Cake, Coffee, Plane, Save, TreePalm, User, Utensils } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";

type FormInputs = {
    desc: string;
    amount: number;
    group: number[];
}

type FormInputs2 = {
    from: string | null;
    to: string | null;
    amount: number;
    desc: string;
}

function NewExpenseModal({ onClose }: { onClose: () => void }) {

    const { pending, data, method, action } = useFormStatus();
    const [formType, setFormType] = useState(0)

    const initInputs: FormInputs = {
        desc: '',
        amount: 50,
        group: [],
    }
    const [inputs, setInputs] = useState(initInputs);

    const initInputs2: FormInputs2 = {
        from: null,
        to: null,
        desc: '',
        amount: 50,
    }
    const [inputs2, setInputs2] = useState(initInputs2);


    const initFormErrors = {
        desc: '',
        amount: '',
        group: '',
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);

    const initFormErrors2 = {
        from: '',
        to: '',
        amount: '',
        desc: '',
    }
    const [formErrors2, setFormErrors2] = useState(initFormErrors2);

    // function selectLabelHandler(label: string) {
    //     setInputs(prev => ({ ...prev, label }))
    // }

    // function isLabelSelected(label: string) {
    //     return inputs.label === label;
    // }

    function formActionHandler(formData: FormData) {
        let formDataObj = Object.fromEntries(formData.entries());

        let { hasError, errors } = zValidate(eventSchema, formDataObj);

        if (hasError) {
            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);
        console.log("passed")
    }

    function isPersonSelected(personId: number) {
        return inputs.group.includes(personId);
    }

    function togglePerson(personId: number) {
        if (isPersonSelected(personId)) {
            setInputs(prev => ({ ...prev, group: prev.group.filter(id => id !== personId) }))
        } else {
            setInputs(prev => ({ ...prev, group: [...prev.group, personId] }))
        }
    }

    function selectFromPerson(personId: string) {
        setInputs2(prev => ({ ...prev, from: personId }))
    }

    function selectToPerson(personId: string) {
        setInputs2(prev => ({ ...prev, to: personId }))
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl">
                    <ModalHeader title="افزودن هزینه" onClose={onClose} />


                    <div className="grid grid-cols-2">
                        <div className={`col-span-1 select-none py-3 cursor-pointer text-center hover:bg-violet-100 ${formType === 0 ? 'bg-violet-100 text-violet-900' : 'bg-white text-gray-700'}`} onClick={() => setFormType(0)}>
                            هزینه
                        </div>
                        <div className={`col-span-1 select-none py-3 cursor-pointer text-center hover:bg-violet-100 ${formType === 1 ? 'bg-violet-100 text-violet-900' : 'bg-white text-gray-700'}`} onClick={() => setFormType(1)}>
                            جابجایی پول
                        </div>
                    </div>


                    {formType === 0 && (
                        <form action={formActionHandler} className="">

                            <div className="p-5 flex flex-col gap-y-4">

                                <TextInput name="amount" type="number" inpProps={{ min: 50, step: 100000 }} value={inputs.amount} error={formErrors.amount} label="هزینه (تومان)" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                                <TextInput name="desc" value={inputs.desc} error={formErrors.desc} label="توضیحات" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                                <span className={`text-base ${formErrors.group ? 'text-red-500' : 'text-violet-900'} capitalize`}>کیا سهیم بودن؟</span>

                                <div className="flex flex-wrap gap-4">

                                    <div onClick={togglePerson.bind(null, 1)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(1) ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدحسین</span>
                                    </div>
                                    <div onClick={togglePerson.bind(null, 2)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(2) ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">علی</span>
                                    </div>
                                    <div onClick={togglePerson.bind(null, 3)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(3) ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">علی رضا</span>
                                    </div>
                                    <div onClick={togglePerson.bind(null, 4)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(4) ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">میلاد</span>
                                    </div>
                                    <div onClick={togglePerson.bind(null, 5)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(5) ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدقادر</span>
                                    </div>
                                    <div onClick={togglePerson.bind(null, 6)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(6) ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدامین</span>
                                    </div>
                                    <div onClick={togglePerson.bind(null, 7)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(7) ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">رضا</span>
                                    </div>
                                    <div onClick={togglePerson.bind(null, 8)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${isPersonSelected(8) ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">حامد</span>
                                    </div>

                                </div>


                                {formErrors.group && (
                                    <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                        <Ban className="size-3.5" />
                                        <span>{formErrors.group}</span>
                                    </div>
                                )}
                                <input type="hidden" value={inputs.group.toString()} name="group" />
                            </div>


                            <div className="p-5 flex justify-end">
                                <button disabled={pending} type="submit" className="hover:bg-violet-100 flex gap-x-2 items-center transition-all duration-300 rounded-xl text-violet-900 text-base px-4 py-2">
                                    <span>{pending ? 'در حال ثبت' : 'ثبت'}</span>
                                    <Save className="size-4" />
                                </button>
                            </div>

                        </form>
                    )}

                    {formType === 1 && (
                        <form action={formActionHandler} className="">

                            <div className="p-5 flex flex-col gap-y-4">

                                <TextInput name="amount" type="number" inpProps={{ min: 50, step: 100000 }} value={inputs.amount} error={formErrors.amount} label="هزینه (تومان)" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                                <TextInput name="desc" value={inputs.desc} error={formErrors.desc} label="توضیحات" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                                <span className={`text-base ${formErrors2.from ? 'text-red-500' : 'text-violet-900'} capitalize`}>مبداء</span>

                                <div className="flex flex-wrap gap-4">

                                    <div onClick={selectFromPerson.bind(null, 'p1')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === 'p1' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدحسین</span>
                                    </div>
                                    <div onClick={selectFromPerson.bind(null, 'p2')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === 'p2' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">علی</span>
                                    </div>
                                    <div onClick={selectFromPerson.bind(null, 'p3')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === 'p3' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">علی رضا</span>
                                    </div>
                                    <div onClick={selectFromPerson.bind(null, 'p4')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === 'p4' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">میلاد</span>
                                    </div>
                                    <div onClick={selectFromPerson.bind(null, 'p5')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === 'p5' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدقادر</span>
                                    </div>
                                    <div onClick={selectFromPerson.bind(null, 'p6')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === 'p6' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدامین</span>
                                    </div>
                                    <div onClick={selectFromPerson.bind(null, 'p7')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === 'p7' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">رضا</span>
                                    </div>
                                    <div onClick={selectFromPerson.bind(null, 'p8')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === 'p8' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">حامد</span>
                                    </div>

                                </div>


                                {formErrors2.from && (
                                    <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                        <Ban className="size-3.5" />
                                        <span>{formErrors2.from}</span>
                                    </div>
                                )}
                                <input type="hidden" value={inputs2.from ?? ''} name="from" />

                                <span className={`text-base ${formErrors2.from ? 'text-red-500' : 'text-violet-900'} capitalize`}>مقصد</span>

                                <div className="flex flex-wrap gap-4">

                                    <div onClick={selectToPerson.bind(null, 'p1')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === 'p1' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدحسین</span>
                                    </div>
                                    <div onClick={selectToPerson.bind(null, 'p2')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === 'p2' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">علی</span>
                                    </div>
                                    <div onClick={selectToPerson.bind(null, 'p3')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === 'p3' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">علی رضا</span>
                                    </div>
                                    <div onClick={selectToPerson.bind(null, 'p4')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === 'p4' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">میلاد</span>
                                    </div>
                                    <div onClick={selectToPerson.bind(null, 'p5')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === 'p5' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدقادر</span>
                                    </div>
                                    <div onClick={selectToPerson.bind(null, 'p6')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === 'p6' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">محمدامین</span>
                                    </div>
                                    <div onClick={selectToPerson.bind(null, 'p7')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === 'p7' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">رضا</span>
                                    </div>
                                    <div onClick={selectToPerson.bind(null, 'p8')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === 'p8' ? 'border-blue-800 bg-blue-100 text-blue-800' : 'border-gray-300 text-gray-500'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">حامد</span>
                                    </div>

                                </div>


                                {formErrors2.from && (
                                    <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                        <Ban className="size-3.5" />
                                        <span>{formErrors2.from}</span>
                                    </div>
                                )}
                                <input type="hidden" value={inputs2.from ?? ''} name="group" />
                            </div>


                            <div className="p-5 flex justify-end">
                                <button disabled={pending} type="submit" className="hover:bg-violet-100 flex gap-x-2 items-center transition-all duration-300 rounded-xl text-violet-900 text-base px-4 py-2">
                                    <span>{pending ? 'در حال ثبت' : 'ثبت'}</span>
                                    <Save className="size-4" />
                                </button>
                            </div>

                        </form>
                    )}
                </section>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default NewExpenseModal;