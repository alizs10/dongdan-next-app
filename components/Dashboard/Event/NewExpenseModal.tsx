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
import { Toast, useToastStore } from "@/store/toast-store";
import { DateObject } from "react-multi-date-picker";
import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";

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

    const addToast = useToastStore(state => state.addToast)
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


    function handleChangeDate(date: DateObject) {

        let selectedDate = new Date(date.toDate());
        selectedDate.setHours(0o0)
        selectedDate.setMinutes(0o0)
        selectedDate.setSeconds(0o0)
        selectedDate.setMilliseconds(1)

        if (formType === 0) {
            setInputs((prev: FormInputs) => ({ ...prev, date: selectedDate }))
        } else {
            setInputs((prev: FormInputs) => ({ ...prev, date: selectedDate }))
        }
    }

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

        let newExpend = {
            id: generateUID(),
            type: 'expend' as const,
            ...inputs,
            amount: TomanPriceToNumber(inputs.amount),
        }

        let { hasError, errors } = zValidate(expendSchema, newExpend);

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



        let newToast: Toast = {
            id: generateUID(),
            message: 'هزینه جدید اضافه شد',
            type: 'success'
        }
        addExpense(event.id, newExpend)
        addToast(newToast)
        onClose();
    }


    function transferFormHandler(formData: FormData) {

        let newTransfer = {
            ...inputs2,
            id: generateUID(),
            type: 'transfer' as const,
            amount: TomanPriceToNumber(inputs2.amount)
        }

        let { hasError, errors } = zValidate(transferSchema, newTransfer);

        if (hasError) {
            console.log(errors)
            let validationToast: Toast = {
                id: generateUID(),
                message: `فرم نامعتبر است.`,
                type: 'danger',
            }


            addToast(validationToast);

            setFormErrors2(errors);
            return;
        }

        setFormErrors2(initFormErrors2);

        let newToast: Toast = {
            id: generateUID(),
            message: 'جابجایی پول جدید اضافه شد',
            type: 'success'
        }
        addExpense(event.id, newTransfer)
        addToast(newToast)
        onClose();
    }

    const getPersonName = useCallback((personId: string) => {
        return event.group.find(p => p.id === personId)?.name || '';
    }, [event.group])

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title={formType === 0 ? 'ثبت هزینه' : 'ثبت جابجایی پول'} onClose={onClose} />


                    <div className="grid grid-cols-2">
                        <div className={`col-span-1 transition-all duration-300 select-none py-3 cursor-pointer text-center ${formType === 0 ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFormType(0)}>
                            هزینه
                        </div>
                        <button disabled={event.group.length < 2} className={`col-span-1 transition-all duration-300 select-none py-3 text-center  ${formType === 1 ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-white' : event.group.length < 2 ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' : 'cursor-pointer bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFormType(event.group.length < 2 ? 0 : 1)}>
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
                                    onChange={handleChangeDate}
                                    error={formErrors.date}
                                    maxDate={new Date()}
                                />

                                <MemberSelector
                                    label="کی پرداخت کرده؟"
                                    members={event.group}
                                    onSelect={selectPayer}
                                    value={inputs.payer}
                                    error={formErrors.payer}
                                />
                                <MemberSelector
                                    label="کیا سهیم بودن؟"
                                    members={event.group}
                                    onSelect={togglePerson}
                                    value={inputs.group}
                                    error={formErrors.group}
                                    selectAllOption={true}
                                />

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
                                    onChange={handleChangeDate}
                                    maxDate={new Date()}
                                />

                                <MemberSelector
                                    label="مبداء"
                                    members={event.group}
                                    onSelect={selectFromPerson}
                                    value={inputs2.from}
                                    error={formErrors2.from}
                                    disalllows={inputs2.to.length > 0 ? [inputs2.to] : []}
                                />
                                <MemberSelector
                                    label="مقصد"
                                    members={event.group}
                                    onSelect={selectToPerson}
                                    value={inputs2.to}
                                    error={formErrors2.to}
                                    disalllows={inputs2.from.length > 0 ? [inputs2.from] : []}
                                />
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
                    )}


                </section>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default NewExpenseModal;