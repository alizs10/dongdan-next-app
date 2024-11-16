'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { generateUID, TomanPriceFormatter, TomanPriceToNumber } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { Ban, Save, User } from "lucide-react";
import { useCallback, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import ExpensePreview from "./ExpensePreview";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import { expendSchema } from "@/database/validations/expend-validation";
import { transferSchema } from "@/database/validations/transfer-validation";
import { Event } from "@/types/event-types";
import { useEventStore } from "@/store/event-store";

type FormInputs = {
    desc: string;
    amount: string;
    group: string[];
    payer: string;
    date: Date;
}

type FormInputs2 = {
    from: string;
    to: string;
    amount: string;
    desc: string;
    date: Date;
}

type FormTypes = 0 | 1;


function NewExpenseModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const addExpense = useEventStore(state => state.addExpense);

    const { pending, data, method, action } = useFormStatus();
    const [formType, setFormType] = useState<FormTypes>(0)

    const initInputs: FormInputs = {
        desc: '',
        amount: '',
        group: [],
        payer: '',
        date: new Date(Date.now())
    }
    const [inputs, setInputs] = useState(initInputs);

    const initInputs2: FormInputs2 = {
        from: '',
        to: '',
        desc: '',
        amount: '',
        date: new Date(Date.now())
    }
    const [inputs2, setInputs2] = useState(initInputs2);


    const initFormErrors = {
        desc: '',
        amount: '',
        group: '',
        payer: '',
        date: '',
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);

    const initFormErrors2 = {
        from: '',
        to: '',
        amount: '',
        desc: '',
        date: '',
    }
    const [formErrors2, setFormErrors2] = useState(initFormErrors2);

    function isPersonSelected(personId: string) {
        return inputs.group.includes(personId);
    }

    function selectPayer(personId: string) {
        setInputs(prev => ({ ...prev, payer: prev.payer === personId ? '' : personId }))
    }

    function togglePerson(personId: string) {

        if (personId === 'all' && inputs.group.length === event.group.length) {
            setInputs(prev => ({ ...prev, group: [] }))
            return
        }
        if (personId === 'all' && inputs.group.length !== event.group.length) {
            setInputs(prev => ({ ...prev, group: event.group.map(p => p.id) }))
            return
        }


        if (isPersonSelected(personId)) {
            setInputs(prev => ({ ...prev, group: prev.group.filter(id => id !== personId) }))
        } else {
            setInputs(prev => ({ ...prev, group: [...prev.group, personId] }))
        }
    }



    function selectFromPerson(personId: string) {
        if (personId === inputs2.to) return
        setInputs2(prev => ({ ...prev, from: prev.from === personId ? '' : personId }))
    }

    function selectToPerson(personId: string) {
        if (personId === inputs2.from) return
        setInputs2(prev => ({ ...prev, to: prev.to === personId ? '' : personId }))
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


    function expendFormHandler(formData: FormData) {

        let { hasError, errors } = zValidate(expendSchema, inputs);

        if (hasError) {
            console.log(errors)

            setFormErrors(errors);
            return;
        }

        setFormErrors(initFormErrors);

        let newExpend = {
            id: generateUID(),
            type: 'expend' as const,
            ...inputs,
            amount: TomanPriceToNumber(inputs.amount),
        }

        addExpense(event.id, newExpend)
        onClose();
    }


    function transferFormHandler(formData: FormData) {

        let { hasError, errors } = zValidate(transferSchema, inputs2);

        if (hasError) {
            console.log(errors)

            setFormErrors2(errors);
            return;
        }

        setFormErrors2(initFormErrors2);

        if (inputs2.to === inputs2.from) return;

        let newTransfer = {
            ...inputs2,
            id: generateUID(),
            type: 'transfer' as const,
            amount: TomanPriceToNumber(inputs2.amount)
        }

        addExpense(event.id, newTransfer)
        onClose();
    }

    const getPersonName = useCallback((personId: string) => {
        return event.group.find(p => p.id === personId)?.name || '';
    }, [event.group])

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[90%]  bg-white rounded-2xl">
                    <ModalHeader title={formType === 0 ? 'ثبت هزینه' : 'ثبت جابجایی پول'} onClose={onClose} />


                    <div className="grid grid-cols-2">
                        <div className={`col-span-1 select-none py-3 cursor-pointer text-center hover:bg-indigo-100 ${formType === 0 ? 'bg-indigo-100 text-indigo-900' : 'bg-white text-gray-700'}`} onClick={() => setFormType(0)}>
                            هزینه
                        </div>
                        <button disabled={event.group.length < 2} className={`col-span-1 select-none py-3 cursor-pointer text-center  ${formType === 1 ? 'hover:bg-indigo-100 bg-indigo-100 text-indigo-900' : event.group.length < 2 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-100 bg-white text-gray-700'}`} onClick={() => setFormType(event.group.length < 2 ? 0 : 1)}>
                            جابجایی پول
                        </button>
                    </div>


                    {formType === 0 && (
                        <form action={expendFormHandler} className="h-full max-h-[70vh] overflow-y-scroll mb-5">

                            <div className="p-5 flex flex-col gap-y-4">

                                <TextInput name="amount" value={inputs.amount} error={formErrors.amount} label="هزینه (تومان)" handleChange={changeAmountHandler} />
                                <TextInput name="desc" value={inputs.desc} error={formErrors.desc} label="توضیحات" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                                <PDatePicker
                                    name="date"
                                    value={inputs.date}
                                    label="تاریخ"
                                    onChange={(date) => setInputs((prev: FormInputs) => ({ ...prev, date: date.toDate() }))}
                                    error={formErrors.date}
                                />

                                <div className="flex flex-col gap-y-2">

                                    <span className={`text-base ${formErrors.payer ? 'text-red-500' : 'text-indigo-900'} capitalize`}>کی پرداخت کرده؟</span>

                                    <div className="flex flex-wrap gap-4">

                                        {event.group.map(user => (
                                            <div key={user.id} onClick={selectPayer.bind(null, user.id)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${user.id === inputs.payer ? `user_avatar_${user.scheme}_text user_avatar_${user.scheme}_border user_avatar_${user.scheme}_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
                                                <div className="">
                                                    <User className="size-5" />
                                                </div>

                                                <span className="text-base">{user.name}</span>
                                            </div>
                                        ))}

                                    </div>


                                    {formErrors.payer && (
                                        <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                            <Ban className="size-3.5" />
                                            <span>{formErrors.payer}</span>
                                        </div>
                                    )}
                                    <input type="hidden" value={inputs.payer} name="payer" />
                                </div>
                                <div className="flex flex-col gap-y-2">

                                    <span className={`text-base ${formErrors.group ? 'text-red-500' : 'text-indigo-900'} capitalize`}>کیا سهیم بودن؟</span>

                                    <div className="flex flex-wrap gap-4">

                                        <div onClick={togglePerson.bind(null, 'all')} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs.group.length === event.group.length ? `user_avatar_blue_text user_avatar_blue_border user_avatar_blue_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
                                            <div className="">
                                                <User className="size-5" />
                                            </div>

                                            <span className="text-base">همه</span>
                                        </div>


                                        {event.group.map(user => (
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

                            </div>

                            {inputs.group.length > 0 && inputs.amount.length > 0 && inputs.desc.length > 0 && inputs.payer && (
                                <ExpensePreview
                                    type={formType === 0 ? 'expend' : 'transfer'}
                                    group={inputs.group}
                                    amount={inputs.amount}
                                    desc={inputs.desc}
                                    payer={getPersonName(inputs.payer)}
                                />
                            )}
                            <div className="p-5 flex justify-end">
                                <button disabled={pending} type="submit" className="hover:bg-indigo-100 flex gap-x-2 items-center transition-all duration-300 rounded-xl text-indigo-900 text-base px-4 py-2">
                                    <span>{pending ? 'در حال ثبت' : 'ثبت'}</span>
                                    <Save className="size-4" />
                                </button>
                            </div>

                        </form>
                    )}

                    {formType === 1 && (
                        <form action={transferFormHandler} className="h-full max-h-[70vh] overflow-y-scroll mb-5">

                            <div className="p-5 flex flex-col gap-y-4">

                                <TextInput name="amount" value={inputs2.amount} error={formErrors2.amount} label="هزینه (تومان)" handleChange={changeAmountHandler} />
                                <TextInput name="desc" value={inputs2.desc} error={formErrors2.desc} label="توضیحات" handleChange={e => setInputs2(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                                <PDatePicker
                                    label={'تاریخ'}
                                    name={"date"}
                                    value={inputs2.date}
                                    error={formErrors2.date}
                                    onChange={(date) => setInputs2((prev: FormInputs2) => ({ ...prev, date: date.toDate() }))}
                                />

                                <span className={`text-base ${formErrors2.from ? 'text-red-500' : 'text-indigo-900'} capitalize`}>مبداء</span>

                                <div className="flex flex-wrap gap-4">

                                    {event.group.map(user => (
                                        <div key={user.id} onClick={selectFromPerson.bind(null, user.id)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.to === user.id ? 'border-gray-300 text-gray-300' : inputs2.from === user.id ? `user_avatar_${user.scheme}_border user_avatar_${user.scheme}_text user_avatar_${user.scheme}_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
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

                                <span className={`text-base ${formErrors2.to ? 'text-red-500' : 'text-indigo-900'} capitalize`}>مقصد</span>

                                <div className="flex flex-wrap gap-4">

                                    {event.group.map(user => (
                                        <div key={user.id} onClick={selectToPerson.bind(null, user.id)} className={`px-4 cursor-pointer py-2 flex flex-row gap-x-4 items-center border ${inputs2.from === user.id ? 'border-gray-300 text-gray-300' : inputs2.to === user.id ? `user_avatar_${user.scheme}_border user_avatar_${user.scheme}_text user_avatar_${user.scheme}_bg` : 'user_avatar_gray_text border-white'} transition-all duration-300 rounded-full`}>
                                            <div className="">
                                                <User className="size-5" />
                                            </div>

                                            <span className="text-base">{user.name}</span>
                                        </div>
                                    ))}

                                </div>


                                {formErrors2.to && (
                                    <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                                        <Ban className="size-3.5" />
                                        <span>{formErrors2.to}</span>
                                    </div>
                                )}
                                <input type="hidden" value={inputs2.to ?? ''} name="to" />
                            </div>

                            {inputs2.from && inputs2.amount.length > 0 && inputs2.desc.length > 0 && inputs2.to && (
                                <ExpensePreview
                                    type={formType === 1 ? 'transfer' : 'expend'}
                                    amount={inputs2.amount}
                                    desc={inputs2.desc}
                                    from={getPersonName(inputs2.from)}
                                    to={getPersonName(inputs2.to)}
                                />
                            )}

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