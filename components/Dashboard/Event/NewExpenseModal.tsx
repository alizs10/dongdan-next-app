'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { TomanPriceFormatter, TomanPriceToNumber } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { Save } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import ExpensePreview from "./ExpensePreview";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import { Event } from "@/types/event-types";
import { useToastStore } from "@/store/toast-store";
import { DateObject } from "react-multi-date-picker";
import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import { useAppStore } from "@/store/app-store";
import { createExpendSchema, createTransferSchema } from "@/database/validations/expense-validation";
import { CreateExpendReqInputs, createExpenseReq, CreateTransferReqInputs } from "@/app/actions/event";
import { EventContext } from "@/context/EventContext";
import ToggleInput from "@/components/Common/Form/ToggleInput";
import MemberSelectorWithAmountInput from "@/components/Common/Form/MemberSelectorWithAmountInput";

type FormInputs = {
    description: string;
    amount: string;
    payer: string;
    date: Date;
    contributors: {
        key: string;
        amount: string;
    }[];
    equal_shares: 0 | 1;
}

type FormInputs2 = {
    transmitter: string;
    receiver: string;
    amount: string;
    description: string;
    date: Date;
}

type FormTypes = 0 | 1;


function NewExpenseModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const user = useAppStore(state => state.user)
    const addToast = useToastStore(state => state.addToast)

    const { addExpense } = useContext(EventContext);

    const [formType, setFormType] = useState<FormTypes>(0)
    const [expendFormLoading, setExpendFormLoading] = useState(false)
    const [transferFormLoading, setTransferFormLoading] = useState(false)

    const initInputs: FormInputs = {
        description: '',
        amount: '',
        contributors: [],
        payer: '',
        date: new Date(Date.now()),
        equal_shares: 1
    }
    const [inputs, setInputs] = useState(initInputs);

    const initInputs2: FormInputs2 = {
        transmitter: '',
        receiver: '',
        description: '',
        amount: '',
        date: new Date(Date.now())
    }
    const [inputs2, setInputs2] = useState(initInputs2);


    const initFormErrors = {
        description: '',
        amount: '',
        contributors: '',
        payer: '',
        date: '',
    }
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);

    const initFormErrors2 = {
        transmitter: '',
        receiver: '',
        amount: '',
        description: '',
        date: '',
    }
    const [formErrors2, setFormErrors2] = useState<Record<string, string>>(initFormErrors2);


    const expenseTotalAmount = useCallback(() => {
        return inputs.contributors.reduce((acc, value) => {
            return acc + TomanPriceToNumber(value.amount);
        }, 0);
    }, [inputs.contributors])


    function toggleEqualShares() {
        setInputs((prev: FormInputs) => ({ ...prev, equal_shares: prev.equal_shares === 1 ? 0 : 1 }))
    }

    useEffect(() => {

        if (inputs.equal_shares === 0 && inputs.contributors.length > 0) {
            const totalAmount = inputs.contributors.reduce((pv, cv) => pv + TomanPriceToNumber(cv.amount), 0);
            const formattedAmount = TomanPriceFormatter(totalAmount.toString());

            if (formattedAmount !== inputs.amount) {
                setInputs((prev: FormInputs) => ({ ...prev, amount: formattedAmount }));
            }
        }

    }, [inputs.equal_shares, inputs.amount, inputs.contributors])

    useEffect(() => {

        if (inputs.equal_shares === 1 && inputs.contributors.length > 0) {
            const totalAmount = TomanPriceToNumber(inputs.amount);
            const equalShare = Math.floor(totalAmount / inputs.contributors.length);
            const reminder = totalAmount % inputs.contributors.length;

            const updatedContributors = inputs.contributors.map((c, i) => ({
                key: c.key,
                amount: (i === 0 && reminder > 0)
                    ? TomanPriceFormatter((equalShare + reminder).toString())
                    : TomanPriceFormatter(equalShare.toString())
            }));

            setInputs((prev: FormInputs) => ({ ...prev, contributors: updatedContributors }));
        }



    }, [inputs.amount, inputs.contributors.length, inputs.equal_shares])


    function handleChangeDate(date: DateObject) {

        const selectedDate = new Date(date.toDate());
        selectedDate.setHours(0o0)
        selectedDate.setMinutes(0o0)
        selectedDate.setSeconds(0o0)
        selectedDate.setMilliseconds(1)

        if (formType === 0) {
            setInputs((prev: FormInputs) => ({ ...prev, date: selectedDate }))
        } else {
            setInputs2((prev: FormInputs2) => ({ ...prev, date: selectedDate }))
        }
    }

    function isMemberContributor(memberId: string) {
        return inputs.contributors.some(c => c.key === memberId);
    }


    function selectPayer(memberId: string) {
        setInputs(prev => ({ ...prev, payer: prev.payer === memberId ? '' : memberId }))
    }

    function toggleAllContributors() {

        if (inputs.contributors.length === event.members.length) {
            setInputs(prev => ({ ...prev, contributors: [] }))
            return
        }

        setInputs(prev => ({ ...prev, contributors: event.members.map(m => ({ key: m.id.toString(), amount: '' })) ?? [] }))

    }

    function toggleContributor(actionKey: string) {

        if (actionKey === 'all') {
            toggleAllContributors()
            return
        }

        if (isMemberContributor(actionKey)) {
            setInputs(prev => ({ ...prev, contributors: prev.contributors.filter(c => c.key !== actionKey) }))
        } else {
            setInputs(prev => ({ ...prev, contributors: [...prev.contributors, { key: actionKey, amount: '' }] }))
        }
    }

    function changeContributorAmountHandler(key: string, amount: string) {

        if (inputs.equal_shares === 1) return

        const regex = /^[0-9]+$/;
        amount = amount.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setInputs(prev => ({ ...prev, contributors: prev.contributors.map(c => c.key === key ? { ...c, amount: TomanPriceFormatter(amount) } : c) }))
    }

    function selectTransmitter(memberId: string) {
        if (memberId === inputs2.receiver) return
        setInputs2(prev => ({ ...prev, transmitter: prev.transmitter === memberId ? '' : memberId }))
    }

    function selectReceiver(memberId: string) {
        if (memberId === inputs2.transmitter) return
        setInputs2(prev => ({ ...prev, receiver: prev.receiver === memberId ? '' : memberId }))
    }


    function changeAmountHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        const amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        if (formType === 0) {
            setInputs(prev => ({ ...prev, amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))
        } else {
            setInputs2(prev => ({ ...prev, amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))
        }
    }


    async function expendFormHandler() {

        if (expendFormLoading) return
        setExpendFormLoading(true)

        const newExpendInputs: CreateExpendReqInputs = {
            description: inputs.description,
            type: 'expend' as const,
            date: inputs.date,
            payer_id: inputs.payer,
            equal_shares: inputs.equal_shares,
            contributors: inputs.contributors.map(mc => ({ event_member_id: mc.key, amount: TomanPriceToNumber(mc.amount).toString() })),
        }

        const { hasError, errors } = zValidate(createExpendSchema, newExpendInputs);

        if (hasError) {
            const validationToast = {

                message: `فرم نامعتبر است.`,
                type: 'danger' as const,
            }

            const compactErrors: Record<string, string> = {}
            for (const errorKey in errors) {
                if (errorKey.includes('contributors')) {
                    if (!compactErrors['contributors']) {
                        compactErrors['contributors'] = (errors as Record<string, string>)[errorKey]
                    }
                } else {
                    compactErrors[errorKey] = (errors as Record<string, string>)[errorKey]
                }
            }

            addToast(validationToast);
            setFormErrors(compactErrors);
            setExpendFormLoading(false)
            return;
        }
        setFormErrors(initFormErrors);



        const res = await createExpenseReq(event.id, newExpendInputs)

        if (res.success) {

            const successToast = {
                message: res.message,
                type: 'success' as const,
            }
            addExpense(res.expense)
            addToast(successToast)
            setExpendFormLoading(false)
            onClose();
            return
        }

        const errorToast = {
            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
        setExpendFormLoading(false)
    }


    async function transferFormHandler() {

        if (transferFormLoading) return
        setTransferFormLoading(true)

        const newTransferInputs: CreateTransferReqInputs = {
            description: inputs2.description,
            amount: TomanPriceToNumber(inputs2.amount).toString(),
            type: 'transfer' as const,
            date: inputs2.date,
            transmitter_id: inputs2.transmitter,
            receiver_id: inputs2.receiver,
        }

        const { hasError, errors } = zValidate(createTransferSchema, newTransferInputs);

        if (hasError) {
            console.log(errors)
            const validationToast = {
                message: `فرم نامعتبر است.`,
                type: 'danger' as const,
            }
            addToast(validationToast);
            setFormErrors2(errors);
            setTransferFormLoading(false)
            return;
        }
        setFormErrors2(initFormErrors2);

        const res = await createExpenseReq(event.id, newTransferInputs)

        if (res.success) {
            const successToast = {
                message: res.message,
                type: 'success' as const,
            }

            addExpense(res.expense)
            addToast(successToast)
            setTransferFormLoading(false)
            onClose();
            return
        }

        const errorToast = {
            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
        setTransferFormLoading(false)
    }

    const getMemberName = useCallback((memberId: string) => {

        let member = event.members.find(p => p.id.toString() === memberId)

        if (member?.member_id === user?.id) return 'خودم'

        return member?.name || 'نامشخص';
    }, [event.members])

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title={formType === 0 ? 'ثبت هزینه' : 'ثبت جابجایی پول'} onClose={onClose} />


                    <div className="grid grid-cols-2">
                        <div className={`col-span-1 transition-all duration-300 select-none py-3 cursor-pointer text-center ${formType === 0 ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFormType(0)}>
                            هزینه
                        </div>
                        <button disabled={event.members.length < 2} className={`col-span-1 transition-all duration-300 select-none py-3 text-center  ${formType === 1 ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-white' : event.members.length < 2 ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' : 'cursor-pointer bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFormType(event.members.length < 2 ? 0 : 1)}>
                            جابجایی پول
                        </button>
                    </div>


                    {formType === 0 && (
                        <section className="h-full max-h-[70vh] overflow-y-scroll mb-5">

                            <div className="p-5 flex flex-col gap-y-4">


                                <TextInput name="description" value={inputs.description} error={formErrors.description} label="توضیحات" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                                <PDatePicker
                                    name="date"
                                    value={inputs.date}
                                    label="تاریخ"
                                    onChange={handleChangeDate}
                                    error={formErrors.date}
                                    maxDate={new Date()}
                                />

                                {user && (<>
                                    <MemberSelector
                                        label="کی پرداخت کرده؟"
                                        members={event.members}
                                        onSelect={selectPayer}
                                        value={inputs.payer}
                                        error={formErrors.payer_id}
                                        self={{
                                            id: user.id.toString(),
                                            include: false,
                                            scheme: user.scheme
                                        }}
                                    />
                                    <ToggleInput label='دنگ های یکسان' name='equal_shares' value={inputs.equal_shares === 1} handleChange={toggleEqualShares} />

                                    {inputs.equal_shares === 1 && (
                                        <TextInput
                                            name="amount"
                                            value={inputs.amount}
                                            error={formErrors.amount}
                                            label="هزینه (تومان)"
                                            handleChange={changeAmountHandler}
                                        // disabled={!inputs.equal_shares}
                                        />
                                    )}

                                    <MemberSelectorWithAmountInput
                                        label="کیا سهیم بودن؟"
                                        members={event.members}
                                        onSelect={toggleContributor}
                                        onChangeAmount={changeContributorAmountHandler}
                                        values={inputs.contributors}
                                        error={formErrors.contributors}
                                        selectAllOption={true}
                                        self={{
                                            id: user.id.toString(),
                                            include: false,
                                            scheme: user.scheme
                                        }}
                                        disabledInputs={inputs.equal_shares === 1}
                                    />

                                </>)}

                            </div>

                            {inputs.contributors.length > 0 && inputs.description.length > 0 && inputs.payer && (
                                <ExpensePreview
                                    type={formType === 0 ? 'expend' : 'transfer'}
                                    contributors={inputs.contributors.map(c => c.key)}
                                    amount={TomanPriceFormatter(expenseTotalAmount().toString())}
                                    description={inputs.description}
                                    payer={getMemberName(inputs.payer)}
                                />
                            )}
                            <div className="p-5 flex justify-end">
                                <Button
                                    text={expendFormLoading ? 'در حال ثبت' : 'ثبت'}
                                    icon={<Save className="size-4" />}
                                    onClick={expendFormHandler}
                                    size="medium"
                                    color="accent"
                                    type="button"
                                />
                            </div>

                        </section>
                    )}

                    {formType === 1 && (
                        <section className="h-full max-h-[70vh] overflow-y-scroll mb-5">

                            <div className="p-5 flex flex-col gap-y-4">

                                <TextInput name="amount" value={inputs2.amount} error={formErrors2.amount} label="هزینه (تومان)" handleChange={changeAmountHandler} />
                                <TextInput name="description" value={inputs2.description} error={formErrors2.description} label="توضیحات" handleChange={e => setInputs2(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                                <PDatePicker
                                    label={'تاریخ'}
                                    name={"date"}
                                    value={inputs2.date}
                                    error={formErrors2.date}
                                    onChange={handleChangeDate}
                                    maxDate={new Date()}
                                />

                                {user && (<>
                                    <MemberSelector
                                        label="مبداء"
                                        members={event.members}
                                        onSelect={selectTransmitter}
                                        value={inputs2.transmitter}
                                        error={formErrors2.transmitter}
                                        disalllows={inputs2.receiver.length > 0 ? [inputs2.receiver] : []}
                                        self={{
                                            id: user.id.toString(),
                                            include: false,
                                            scheme: user.scheme
                                        }}
                                    />
                                    <MemberSelector
                                        label="مقصد"
                                        members={event.members}
                                        onSelect={selectReceiver}
                                        value={inputs2.receiver}
                                        error={formErrors2.receiver}
                                        disalllows={inputs2.transmitter.length > 0 ? [inputs2.transmitter] : []}
                                        self={{
                                            id: user.id.toString(),
                                            include: false,
                                            scheme: user.scheme
                                        }}
                                    />
                                </>)}
                            </div>

                            {inputs2.transmitter && inputs2.amount.length > 0 && inputs2.description.length > 0 && inputs2.receiver && (
                                <ExpensePreview
                                    type={formType === 1 ? 'transfer' : 'expend'}
                                    amount={inputs2.amount}
                                    description={inputs2.description}
                                    transmitter={getMemberName(inputs2.transmitter)}
                                    receiver={getMemberName(inputs2.receiver)}
                                />
                            )}

                            <div className="p-5 flex justify-end">
                                <Button
                                    text={transferFormLoading ? 'در حال ثبت' : 'ثبت'}
                                    icon={<Save className="size-4" />}
                                    onClick={transferFormHandler}
                                    size="medium"
                                    color="accent"
                                    type="button"
                                />
                            </div>


                        </section>
                    )}


                </section>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default NewExpenseModal;