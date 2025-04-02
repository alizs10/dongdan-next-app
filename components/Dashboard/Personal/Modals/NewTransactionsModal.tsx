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
import { PersonalTransaction } from "@/types/personal-types"; // Assuming you define this
import { createTransactionSchema } from "@/database/validations/personal/transaction-validation"; // To be created
import { createTransactionReq } from "@/app/actions/personal/transaction"; // API call to Laravel

type FormInputs = {
    type: 'income' | 'expense';
    title: string;
    amount: string;
    date: Date;
    category_id: string;
    is_recurring: 0 | 1;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | '';
};

function NewTransactionModal({ onClose }: { onClose: () => void }) {
    const { user, addToast } = useStore(); // Assuming categories are in store

    let categories = []

    const [formLoading, setFormLoading] = useState(false);

    const initInputs: FormInputs = {
        type: 'expense',
        title: '',
        amount: '',
        date: new Date(Date.now()),
        category_id: '',
        is_recurring: 0,
        frequency: '',
    };
    const [inputs, setInputs] = useState(initInputs);

    const initFormErrors = {
        type: '',
        title: '',
        amount: '',
        date: '',
        category_id: '',
        is_recurring: '',
        frequency: '',
    };
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);

    useEffect(() => {
        // Reset frequency if not recurring
        if (inputs.is_recurring === 0 && inputs.frequency !== '') {
            setInputs(prev => ({ ...prev, frequency: '' }));
        }
    }, [inputs.is_recurring]);

    function handleChangeDate(date: DateObject) {
        const selectedDate = new Date(date.toDate());
        selectedDate.setHours(0, 0, 0, 1); // Normalize time
        setInputs(prev => ({ ...prev, date: selectedDate }));
    }

    function toggleType() {
        setInputs(prev => ({ ...prev, type: prev.type === 'income' ? 'expense' : 'income' }));
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

    async function formHandler() {
        if (formLoading) return;
        setFormLoading(true);

        const newTransaction: Partial<PersonalTransaction> = {
            user_id: user?.id.toString() || '',
            type: inputs.type,
            title: inputs.title,
            amount: TomanPriceToNumber(inputs.amount).toString(),
            date: inputs.date,
            category_id: inputs.type === 'expense' ? inputs.category_id : null,
            is_recurring: inputs.is_recurring,
            frequency: inputs.is_recurring === 1 ? inputs.frequency : null,
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

                            <PDatePicker
                                name="date"
                                value={inputs.date}
                                label="تاریخ"
                                onChange={handleChangeDate}
                                error={formErrors.date}
                                maxDate={new Date()}
                            />

                            {/* {inputs.type === 'expense' && (
                                <TextInput
                                    name="category_id"
                                    value={inputs.category_id}
                                    error={formErrors.category_id}
                                    label="دسته‌بندی"
                                    handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                    type="select"
                                    options={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
                                />
                            )} */}

                            <ToggleInput
                                label="تکرارشونده"
                                name="is_recurring"
                                value={inputs.is_recurring === 1}
                                handleChange={toggleRecurring}
                            />

                            {/* {inputs.is_recurring === 1 && (
                                <TextInput
                                    name="frequency"
                                    value={inputs.frequency}
                                    error={formErrors.frequency}
                                    label="تکرار"
                                    handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                    type="select"
                                    options={[
                                        { value: 'daily', label: 'روزانه' },
                                        { value: 'weekly', label: 'هفتگی' },
                                        { value: 'monthly', label: 'ماهانه' },
                                        { value: 'yearly', label: 'سالانه' },
                                    ]}
                                />
                            )} */}
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