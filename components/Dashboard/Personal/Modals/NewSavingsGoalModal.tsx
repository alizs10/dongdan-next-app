import Button from '@/components/Common/Button'
import PDatePicker from '@/components/Common/Form/PDatePicker'
import TextInput from '@/components/Common/Form/TextInput'
import ModalHeader from '@/components/Common/ModalHeader'
import ModalWrapper from '@/components/Common/ModalWrapper'
import { TomanPriceFormatter } from '@/helpers/helpers'
import { zValidate } from '@/helpers/validation-helper'
import { createSavingsGoalSchema } from '@/database/validations/personal/savings-goal-validations'
import { createSavingsGoalReq } from '@/app/actions/personal/savings-goal'
import useStore from '@/store/store'
import { Save } from 'lucide-react'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { DateObject } from 'react-multi-date-picker'

type FormInputs = {
    name: string;
    amount: string;
    due_date: Date;
}

export default function NewSavingsGoalModal({ onClose }: { onClose: () => void }) {
    const { addToast, addSavingsGoal } = useStore();
    const [loading, setLoading] = useState(false)

    const [inputs, setInputs] = useState({
        name: '',
        amount: '',
        due_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    })

    const [formErrors, setFormErrors] = useState<Record<string, string>>({
        name: '',
        amount: '',
        due_date: '',
    })

    function handleChangeDate(date: DateObject) {
        const selectedDate = new Date(date.toDate());
        selectedDate.setHours(0o0)
        selectedDate.setMinutes(0o0)
        selectedDate.setSeconds(0o0)
        selectedDate.setMilliseconds(1)

        setInputs((prev: FormInputs) => ({ ...prev, due_date: selectedDate }))
    }

    function changeAmountHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        const amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setInputs(prev => ({ ...prev, amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))
    }

    async function handleSubmit() {
        setLoading(true);

        // Validate
        const validationResult = await zValidate(createSavingsGoalSchema, {
            name: inputs.name,
            target_amount: inputs.amount.replaceAll(',', ''),
            due_date: inputs.due_date,
        });

        if (validationResult.hasError) {
            setFormErrors(validationResult.errors as Record<string, string>);
            setLoading(false);
            return;
        }

        // Send to server
        const response = await createSavingsGoalReq({
            name: inputs.name,
            target_amount: parseInt(inputs.amount.replaceAll(',', '')),
            due_date: inputs.due_date.toISOString(),
        });

        if (response.success && response.savingsGoal) {
            addSavingsGoal(response.savingsGoal);
            addToast({
                message: response.message,
                type: 'success',
            });
            onClose();
        } else {
            addToast({
                message: response.message,
                type: 'danger',
            });
        }

        setLoading(false);
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <div
                    onClick={e => e.stopPropagation()}
                    className='modal_container'>
                    <ModalHeader title="هدف جدید" onClose={onClose} />
                    <div className="p-5 flex flex-col gap-y-4">
                        <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام هدف" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                        <TextInput name="amount" value={inputs.amount} error={formErrors.amount} label="مبلغ (تومان)" handleChange={changeAmountHandler} />

                        <PDatePicker
                            label={'مهلت هدف'}
                            name={"date"}
                            value={inputs.due_date}
                            error={formErrors.due_date}
                            onChange={handleChangeDate}
                            minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                        />

                        <div className="flex justify-end">
                            <Button
                                text={loading ? 'در حال ثبت' : 'ثبت'}
                                icon={<Save className="size-4" />}
                                onClick={handleSubmit}
                                size="medium"
                                color="accent"
                                type="submit"
                            />
                        </div>
                    </div>
                </div>
            </ModalWrapper>
            , document.getElementById('modal-portal') as HTMLElement)
    }
}
