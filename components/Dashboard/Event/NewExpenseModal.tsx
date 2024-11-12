'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { eventSchema } from "@/database/validations/event-validation";
import { TomanPriceFormatter } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { Ban, BriefcaseBusiness, Cake, Coffee, Plane, Save, TreePalm, User, Utensils, Zap } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import ExpensePreview from "./ExpensePreview";

type FormInputs = {
    desc: string;
    amount: string;
    group: string[];
}

type FormInputs2 = {
    from: string | null;
    to: string | null;
    amount: string;
    desc: string;
}

type FormTypes = 0 | 1;

const group = [
    {
        id: 'p1',
        name: 'علی',
        scheme: 'gray'
    },
    {
        id: 'p2',
        name: 'محمدحسین',
        scheme: 'rose'
    },
    {
        id: 'p3',
        name: 'میلاد',
        scheme: 'orange'
    },
    {
        id: 'p4',
        name: 'محمدقادر',
        scheme: 'green'
    },
    {
        id: 'p5',
        name: 'رضا',
        scheme: 'yellow'
    },
    {
        id: 'p6',
        name: 'ابوالفضل',
        scheme: 'blue'
    },
    {
        id: 'p7',
        name: 'حامد',
        scheme: 'purple'
    },
    {
        id: 'p8',
        name: 'علیرضا',
        scheme: 'red'
    },
]

function NewExpenseModal({ onClose }: { onClose: () => void }) {

    const { pending, data, method, action } = useFormStatus();
    const [formType, setFormType] = useState<FormTypes>(0)

    const initInputs: FormInputs = {
        desc: '',
        amount: '',
        group: [],
    }
    const [inputs, setInputs] = useState(initInputs);

    const initInputs2: FormInputs2 = {
        from: null,
        to: null,
        desc: '',
        amount: '',
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

    function isPersonSelected(personId: string) {
        return inputs.group.includes(personId);
    }

    function togglePerson(personId: string) {

        if (personId === 'all' && inputs.group.length === group.length) {
            setInputs(prev => ({ ...prev, group: [] }))
            return
        }
        if (personId === 'all' && inputs.group.length !== group.length) {
            setInputs(prev => ({ ...prev, group: group.map(p => p.id) }))
            return
        }


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


    function changeAmountHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        let amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        if (formType === 0) {
            setInputs(prev => ({ ...prev, amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))
        } else {
            setInputs2(prev => ({ ...prev, amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))
        }
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl">
                    <ModalHeader title="افزودن هزینه" onClose={onClose} />


                    <div className="grid grid-cols-2">
                        <div className={`col-span-1 select-none py-3 cursor-pointer text-center hover:bg-indigo-100 ${formType === 0 ? 'bg-indigo-100 text-indigo-900' : 'bg-white text-gray-700'}`} onClick={() => setFormType(0)}>
                            هزینه
                        </div>
                        <div className={`col-span-1 select-none py-3 cursor-pointer text-center hover:bg-indigo-100 ${formType === 1 ? 'bg-indigo-100 text-indigo-900' : 'bg-white text-gray-700'}`} onClick={() => setFormType(1)}>
                            جابجایی پول
                        </div>
                    </div>


                    {formType === 0 && (
                        <form action={formActionHandler} className="">

                            <div className="p-5 flex flex-col gap-y-4">

                                <TextInput name="amount" value={inputs.amount} error={formErrors.amount} label="هزینه (تومان)" handleChange={changeAmountHandler} />
                                <TextInput name="desc" value={inputs.desc} error={formErrors.desc} label="توضیحات" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                                <span className={`text-base ${formErrors.group ? 'text-red-500' : 'text-indigo-900'} capitalize`}>کیا سهیم بودن؟</span>

                                <div className="flex flex-wrap gap-4">

                                    <div onClick={togglePerson.bind(null, 'all')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs.group.length === group.length ? `user_avatar_blue_text user_avatar_blue_border user_avatar_blue_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
                                        <div className="">
                                            <User className="size-5" />
                                        </div>

                                        <span className="text-base">همه</span>
                                    </div>


                                    {group.map(user => (
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

                            <ExpensePreview />
                            <div className="p-5 flex justify-end">
                                <button disabled={pending} type="submit" className="hover:bg-indigo-100 flex gap-x-2 items-center transition-all duration-300 rounded-xl text-indigo-900 text-base px-4 py-2">
                                    <span>{pending ? 'در حال ثبت' : 'ثبت'}</span>
                                    <Save className="size-4" />
                                </button>
                            </div>

                        </form>
                    )}

                    {formType === 1 && (
                        <form action={formActionHandler} className="">

                            <div className="p-5 flex flex-col gap-y-4">

                                <TextInput name="amount" value={inputs2.amount} error={formErrors2.amount} label="هزینه (تومان)" handleChange={changeAmountHandler} />
                                <TextInput name="desc" value={inputs2.desc} error={formErrors2.desc} label="توضیحات" handleChange={e => setInputs2(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                                <span className={`text-base ${formErrors2.from ? 'text-red-500' : 'text-indigo-900'} capitalize`}>مبداء</span>

                                <div className="flex flex-wrap gap-4">

                                    {group.map(user => (
                                        <div key={user.id} onClick={selectFromPerson.bind(null, user.id)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === user.id ? `user_avatar_${user.scheme}_border user_avatar_${user.scheme}_text user_avatar_${user.scheme}_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
                                            <div className="">
                                                <User className="size-5" />
                                            </div>

                                            <span className="text-base">{user.name}</span>
                                        </div>
                                    ))}


                                </div>


                                {formErrors2.from && (
                                    <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                        <Ban className="size-3.5" />
                                        <span>{formErrors2.from}</span>
                                    </div>
                                )}
                                <input type="hidden" value={inputs2.from ?? ''} name="from" />

                                <span className={`text-base ${formErrors2.from ? 'text-red-500' : 'text-indigo-900'} capitalize`}>مقصد</span>

                                <div className="flex flex-wrap gap-4">

                                    {group.map(user => (
                                        <div key={user.id} onClick={selectToPerson.bind(null, user.id)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === user.id ? `user_avatar_${user.scheme}_border user_avatar_${user.scheme}_text user_avatar_${user.scheme}_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
                                            <div className="">
                                                <User className="size-5" />
                                            </div>

                                            <span className="text-base">{user.name}</span>
                                        </div>
                                    ))}

                                </div>


                                {formErrors2.from && (
                                    <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                        <Ban className="size-3.5" />
                                        <span>{formErrors2.from}</span>
                                    </div>
                                )}
                                <input type="hidden" value={inputs2.from ?? ''} name="group" />
                            </div>

                            <ExpensePreview />


                            <div className="p-5 flex justify-end">
                                <button disabled={pending} type="submit" className="hover:bg-indigo-100 flex gap-x-2 items-center transition-all duration-300 rounded-xl text-indigo-900 text-base px-4 py-2">
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