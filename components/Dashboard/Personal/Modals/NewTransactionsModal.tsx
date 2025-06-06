'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { TomanPriceFormatter, TomanPriceToNumber } from "@/helpers/helpers";
import { zValidate } from "@/helpers/validation-helper";
import { Save } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import { DateObject } from "react-multi-date-picker";
import Button from "@/components/Common/Button";
import ToggleInput from "@/components/Common/Form/ToggleInput";
import useStore from "@/store/store";
import { PersonalTransaction } from "@/types/personal-types";
import { createTransactionSchema } from "@/database/validations/personal/transaction-validation";
import { createTransactionReq } from "@/app/actions/personal/transaction";
import FrequencySelector from "../Inputs/FrequencySelector";
import CategorySelector from "../Inputs/CategorySelector";
import { CreateTransactionRequest } from "@/types/requests/personal/transaction";
import moment from 'jalali-moment';
import { PersonalContext } from "@/context/PersonalContext";

export type NewTransactionFormInputs = {
    type: 'income' | 'expense';
    title: string;
    amount: string;
    date: Date;
    description: string;
    category_ids: string[];
    is_recurring: 0 | 1;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
    savings_goal_id?: number | null; // Optional for new transactions
};

function NewTransactionModal() {
    const { user, addToast, categories, addTransaction } = useStore();
    const { initTransaction, closeNewTransactionModal: onClose } = useContext(PersonalContext);

    const [formLoading, setFormLoading] = useState(false);

    const initInputs: NewTransactionFormInputs = {
        type: initTransaction?.type || 'expense',
        title: initTransaction?.title || '',
        amount: initTransaction?.amount ? TomanPriceFormatter(initTransaction.amount.toString()) : '',
        date: initTransaction?.date ? moment(initTransaction.date, 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ').toDate() : new Date(Date.now()),
        description: initTransaction?.description || '',
        category_ids: initTransaction?.category_ids?.map(id => id.toString()) || [],
        is_recurring: initTransaction?.is_recurring ? 1 : 0,
        frequency: initTransaction?.frequency || null,
        savings_goal_id: initTransaction?.savings_goal_id || null, // Optional for new transactions
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

        const newTransaction: CreateTransactionRequest = {
            type: inputs.type,
            title: inputs.title,
            amount: TomanPriceToNumber(inputs.amount),
            date: inputs.date,
            description: inputs.description.trim() || null,
            category_ids: inputs.category_ids.map(id => parseInt(id)),
            is_recurring: inputs.is_recurring,
            frequency: inputs.is_recurring === 1 ? inputs.frequency : null,
            savings_goal_id: inputs.savings_goal_id || null, // Optional for new transactions
        };

        const { hasError, errors } = zValidate(createTransactionSchema, newTransaction);

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

        const res = await createTransactionReq(newTransaction);

        if (res.success && res.transaction) {
            const successToast = {
                message: 'تراکنش با موفقیت ثبت شد.',
                type: 'success' as const,
            };
            addToast(successToast);
            addTransaction(res.transaction);
            setFormLoading(false);
            onClose();
            return;
        }

        const errorToast = {
            message: res.message || 'خطا در ثبت تراکنش.',
            type: 'danger' as const,
        };
        addToast(errorToast);
        setFormLoading(false);
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="ثبت تراکنش جدید" onClose={onClose} />

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
                                text={formLoading ? 'در حال ثبت' : 'ثبت'}
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

export default NewTransactionModal;