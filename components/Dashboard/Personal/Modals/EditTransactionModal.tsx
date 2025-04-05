'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { TomanPriceFormatter, TomanPriceToNumber } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import { DateObject } from "react-multi-date-picker";
import Button from "@/components/Common/Button";
import ToggleInput from "@/components/Common/Form/ToggleInput";
import useStore from "@/store/store";
import { PersonalTransaction } from "@/types/personal-types";
import { updateTransactionSchema } from "@/database/validations/personal/transaction-validation";
import { updateTransactionReq } from "@/app/actions/personal/transaction";
import { Transaction } from "@/types/personal/transaction-types";
import FrequencySelector from "../Inputs/FrequencySelector";
import CategorySelector from "../Inputs/CategorySelector";
import { UpdateTransactionRequest } from "@/types/requests/personal/transaction";

type FormInputs = {
    type: 'income' | 'expense';
    title: string;
    amount: string;
    date: Date;
    description: string;
    category_ids: string[];
    is_recurring: 0 | 1;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
};

function EditTransactionModal({ onClose, transaction }: { onClose: () => void, transaction: Transaction }) {
    const { user, addToast, categories, updateTransaction } = useStore();

    const [formLoading, setFormLoading] = useState(false);

    // Initialize form inputs with transaction data
    const initInputs: FormInputs = {
        type: transaction.type as 'income' | 'expense',
        title: transaction.title,
        amount: TomanPriceFormatter(transaction.amount.toString()),
        date: new Date(transaction.date),
        description: transaction.description || '',
        category_ids: transaction.categories && transaction.categories.length > 0
            ? transaction.categories.map(cat => cat.id.toString())
            : [],
        is_recurring: transaction.is_recurring ? 1 : 0,
        frequency: transaction.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly' | null,
    };
    const [inputs, setInputs] = useState(initInputs);

    const initFormErrors = {
        type: '',
        title: '',
        amount: '',
        date: '',
        description: '',
        category_ids: '',
        is_recurring: '',
        frequency: '',
    };
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);

    useEffect(() => {
        // Reset frequency if not recurring
        if (inputs.is_recurring === 0 && inputs.frequency !== null) {
            setInputs(prev => ({ ...prev, frequency: null }));
        }
    }, [inputs.is_recurring]);

    function handleChangeDate(date: DateObject) {
        const selectedDate = new Date(date.toDate());
        selectedDate.setHours(0, 0, 0, 1); // Normalize time
        setInputs(prev => ({ ...prev, date: selectedDate }));
    }

    function toggleType() {
        setInputs(prev => ({ ...prev, type: prev.type === 'income' ? 'expense' : 'income' }));
        // Clear category selection when switching to income type
        if (inputs.type === 'expense') {
            setInputs(prev => ({ ...prev, category_ids: [] }));
        }
    }

    function toggleRecurring() {
        setInputs(prev => ({ ...prev, is_recurring: prev.is_recurring === 1 ? 0 : 1 }));
    }

    function changeAmountHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        const amount = e.target.value.replaceAll(',', '');
        if (amount.length > 0 && !regex.test(amount)) return;
        setInputs(prev => ({ ...prev, amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }));
    }

    function handleFrequencyChange(value: 'daily' | 'weekly' | 'monthly' | 'yearly' | null) {
        setInputs(prev => ({ ...prev, frequency: value }));
    }

    function handleCategoriesChange(categoryIds: string[]) {
        setInputs(prev => ({ ...prev, category_ids: categoryIds }));
    }

    async function formHandler() {
        if (formLoading) return;
        setFormLoading(true);

        const updatedTransaction: UpdateTransactionRequest = {
            id: transaction.id,
            // user_id: user?.id.toString() || '',
            type: inputs.type,
            title: inputs.title,
            amount: TomanPriceToNumber(inputs.amount),
            date: inputs.date,
            description: inputs.description.trim() || null,
            category_ids: inputs.category_ids.map(id => parseInt(id)),
            is_recurring: inputs.is_recurring,
            frequency: inputs.is_recurring === 1 ? inputs.frequency : null,
        };

        const { hasError, errors } = zValidate(updateTransactionSchema, updatedTransaction);

        if (hasError) {
            const validationToast = {
                message: 'فرم نامعتبر است.',
                type: 'danger' as const,
            };
            addToast(validationToast);
            setFormErrors(errors);
            setFormLoading(false);
            return;
        }
        setFormErrors(initFormErrors);

        try {
            const res = await updateTransactionReq(updatedTransaction);

            if (res.success && res.transaction) {
                updateTransaction(res.transaction);
                const successToast = {
                    message: 'تراکنش با موفقیت بروزرسانی شد.',
                    type: 'success' as const,
                };
                addToast(successToast);
                setFormLoading(false);
                onClose();
                return;
            }

            const errorToast = {
                message: res.message || 'خطا در بروزرسانی تراکنش.',
                type: 'danger' as const,
            };
            addToast(errorToast);
        } catch (error) {
            const errorToast = {
                message: 'خطا در ارتباط با سرور.',
                type: 'danger' as const,
            };
            addToast(errorToast);
        }

        setFormLoading(false);
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="ویرایش تراکنش" onClose={onClose} />

                    <div className="grid grid-cols-2">
                        <div
                            className={`col-span-1 transition-all duration-300 select-none py-3 cursor-pointer text-center ${inputs.type === 'expense'
                                ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-white'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                                }`}
                            onClick={toggleType}
                        >
                            هزینه
                        </div>
                        <div
                            className={`col-span-1 transition-all duration-300 select-none py-3 cursor-pointer text-center ${inputs.type === 'income'
                                ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-white'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                                }`}
                            onClick={toggleType}
                        >
                            درآمد
                        </div>
                    </div>

                    <section className="h-full max-h-[70vh] overflow-y-scroll mb-5">
                        <div className="p-5 flex flex-col gap-y-4">
                            <TextInput
                                name="title"
                                value={inputs.title}
                                error={formErrors.title}
                                label="عنوان"
                                handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            />

                            <TextInput
                                name="amount"
                                value={inputs.amount}
                                error={formErrors.amount}
                                label="مبلغ (تومان)"
                                handleChange={changeAmountHandler}
                            />

                            <TextInput
                                name="description"
                                value={inputs.description}
                                error={formErrors.description}
                                label="توضیحات"
                                handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            />

                            <PDatePicker
                                name="date"
                                value={inputs.date}
                                label="تاریخ"
                                onChange={handleChangeDate}
                                error={formErrors.date}
                                maxDate={new Date()}
                            />

                            <CategorySelector
                                categories={categories}
                                selectedIds={inputs.category_ids}
                                onChange={handleCategoriesChange}
                                error={formErrors.category_ids}
                                multiSelect={true}
                            />


                            <ToggleInput
                                label="تکرارشونده"
                                name="is_recurring"
                                value={inputs.is_recurring === 1}
                                handleChange={toggleRecurring}
                            />

                            {inputs.is_recurring === 1 && (
                                <FrequencySelector
                                    value={inputs.frequency}
                                    onChange={handleFrequencyChange}
                                    error={formErrors.frequency}
                                />
                            )}
                        </div>

                        <div className="p-5 flex justify-end">
                            <Button
                                text={formLoading ? 'در حال ذخیره' : 'ذخیره تغییرات'}
                                icon={<Save className="size-4" />}
                                onClick={formHandler}
                                size="medium"
                                color="accent"
                                type="button"
                            />
                        </div>
                    </section>
                </section>
            </ModalWrapper>,
            document.getElementById("modal-portal")!
        );
    }

    return null;
}

export default EditTransactionModal; 