'use client'

import Button from '@/components/Common/Button'
import TextInput from '@/components/Common/Form/TextInput'
import ModalHeader from '@/components/Common/ModalHeader'
import ModalWrapper from '@/components/Common/ModalWrapper'
import { TomanPriceFormatter } from '@/helpers/helpers'
import { zValidate } from '@/helpers/validation-helper'
import useStore from '@/store/store'
import { Save } from 'lucide-react'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import Select from '@/components/Common/Form/Select'
import { updateBudgetLimitReq } from '@/app/actions/personal/budget-limit'
import { createBudgetLimitSchema } from '@/database/validations/personal/budget-limit-validations'
import { BudgetLimit } from '@/types/personal/limit-types'

type FormInputs = {
    name: string;
    category_id: string | null;
    amount: string;
    period: 'weekly' | 'monthly' | 'yearly';
}

export default function EditBudgetLimitModal({ onClose, limit }: { onClose: () => void, limit: BudgetLimit }) {
    const { addToast, updateBudgetLimit, categories, user } = useStore();
    const [loading, setLoading] = useState(false)

    const [inputs, setInputs] = useState<FormInputs>({
        name: limit.name,
        category_id: limit.category_id ? limit.category_id.toString() : null,
        amount: TomanPriceFormatter(limit.amount.toString()),
        period: limit.period,
    })

    const [formErrors, setFormErrors] = useState<Record<string, string>>({
        name: '',
        category_id: '',
        amount: '',
        period: '',
    })

    function changeAmountHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        const amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setInputs(prev => ({ ...prev, amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))
    }

    async function handleSubmit() {
        setLoading(true);

        const validationResult = await zValidate(createBudgetLimitSchema, {
            name: inputs.name,
            category_id: inputs.category_id,
            amount: inputs.amount.replaceAll(',', ''),
            period: inputs.period,
        });

        if (validationResult.hasError) {
            setFormErrors(validationResult.errors as Record<string, string>);
            setLoading(false);
            return;
        }

        try {
            const result = await updateBudgetLimitReq({
                id: limit.id,
                name: inputs.name,
                category_id: inputs.category_id ? parseInt(inputs.category_id) : null,
                amount: parseInt(inputs.amount.replaceAll(',', '')),
                period: inputs.period,
                user_id: user?.id || 0,
            });

            if (result.success && result.budgetLimit) {
                updateBudgetLimit(result.budgetLimit);
                addToast({
                    message: result.message,
                    type: 'success',
                });
                onClose();
            } else {
                addToast({
                    message: result.message,
                    type: 'danger',
                });
            }
        } catch (error) {
            console.error('Error updating budget limit:', error);
            addToast({
                message: 'خطای سرور',
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
                    <ModalHeader title="ویرایش محدودیت بودجه" onClose={onClose} />
                    <div className="p-5 flex flex-col gap-y-4">
                        <TextInput
                            name="name"
                            value={inputs.name}
                            error={formErrors.name}
                            label="نام محدودیت"
                            handleChange={e => setInputs(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Select
                            name="category_id"
                            value={inputs.category_id || ''}
                            error={formErrors.category_id}
                            label="دسته‌بندی"
                            options={[
                                { value: '', label: 'همه دسته‌بندی‌ها' },
                                ...categories.map(category => ({
                                    value: category.id.toString(),
                                    label: category.name
                                }))
                            ]}
                            handleChange={e => setInputs(prev => ({
                                ...prev,
                                [e.target.name]: e.target.value === '' ? null : e.target.value
                            }))}
                        />
                        <TextInput
                            name="amount"
                            value={inputs.amount}
                            error={formErrors.amount}
                            label="مبلغ (تومان)"
                            handleChange={changeAmountHandler}
                        />
                        <Select
                            name="period"
                            value={inputs.period}
                            error={formErrors.period}
                            label="دوره"
                            options={[
                                { value: 'weekly', label: 'هفتگی' },
                                { value: 'monthly', label: 'ماهانه' },
                                { value: 'yearly', label: 'سالانه' }
                            ]}
                            handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
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