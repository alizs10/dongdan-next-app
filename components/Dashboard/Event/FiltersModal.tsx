'use client'

import { AnyExpense, Expend, ExpendFilters, ExpenseFilters, TransferFilters, type Event, type Expense, type SchemeType } from "@/types/event-types";
import TextInput from "@/components/Common/Form/TextInput";

import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useEventStore } from "@/store/event-store";
import { generateUID, TomanPriceFormatter } from "@/helpers/helpers";
import { Toast, useToastStore } from "@/store/toast-store";
import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import PRangeDatePicker from "@/components/Common/Form/PRangeDatePicker";
import { anyFilterSchema, expendFilterSchema, transferFilterSchema } from "@/database/validations/filters-validation";

function FiltersModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const addToast = useToastStore(state => state.addToast)


    let tommorowDate = new Date();
    tommorowDate.setDate(tommorowDate.getDate() + 1);

    const initAnyFilters: AnyExpense = {
        type: 'any',
        amountMin: '',
        amountMax: '',
        dateRange: [new Date(), tommorowDate]
    }
    const initExpendFilters: ExpendFilters = {
        type: 'expend',
        amountMin: '',
        amountMax: '',
        payer: '',
        group: [],
        dateRange: [new Date(), tommorowDate]
    }
    const initTransferFilters: TransferFilters = {
        type: 'transfer',
        amountMin: '',
        amountMax: '',
        from: '',
        to: '',
        dateRange: [new Date(), tommorowDate]
    }

    const [filters, setFilters] = useState<ExpenseFilters>(initAnyFilters);


    const initFormErrors = {
        type: '',
        group: '',
        payer: '',
        from: '',
        to: '',
        amountMin: '',
        amountMax: '',
        dateRange: ''
    }
    const [formErrors, setFormErrors] = useState(initFormErrors);

    useEffect(() => {
        setFormErrors(initFormErrors)
    }, [filters.type])

    function selectType(type: ExpenseFilters['type']) {

        let newFiltersState = type === 'transfer' ? { ...initTransferFilters, type } :
            type === 'expend' ? { ...initExpendFilters, type }
                : { ...initAnyFilters, type }

        setFilters(newFiltersState);
    }

    function toggleGroupMember(id: string) {

        if (filters.type !== 'expend') return

        if (id === 'all' && filters.type === 'expend') {
            setFilters((prev) => ({ ...prev, group: (prev.type === 'expend' && prev.group.length === event.group.length) ? [] : event.group.map(m => m.id) }))
            return
        }

        setFilters(prev => prev.type === 'expend' ? ({ ...prev, group: prev.group.includes(id) ? prev.group.filter(mId => mId !== id) : [...prev.group, id] }) : prev)
    }

    function togglePayer(id: string) {
        if (filters.type !== 'expend') return
        setFilters(prev => prev.type === 'expend' ? ({ ...prev, payer: prev.payer === id ? '' : id }) : prev)
    }

    function toggleFrom(id: string) {
        if (filters.type !== 'transfer') return

        if (id === filters.to) return

        setFilters(prev => prev.type === 'transfer' ? ({ ...prev, from: prev.from === id ? '' : id }) : prev)
    }
    function toggleTo(id: string) {
        if (filters.type !== 'transfer') return
        if (id === filters.from) return
        setFilters(prev => prev.type === 'transfer' ? ({ ...prev, to: prev.to === id ? '' : id }) : prev)
    }


    function changeAmountMinHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        let amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setFilters(prev => ({ ...prev, amountMin: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))

    }

    function changeAmountMaxHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        let amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setFilters(prev => ({ ...prev, amountMax: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))

    }

    const { applyFilters } = useEventStore(state => state)

    function handleFilterExpenses() {

        let validationSchema = filters.type === 'any' ? anyFilterSchema : filters.type === 'expend' ? expendFilterSchema : transferFilterSchema;

        const { errors, hasError } = zValidate(validationSchema, filters);

        if (hasError) {

            let validationToast: Toast = {
                id: generateUID(),
                message: `فرم فیلتر ها نامعتبر است.`,
                type: 'danger',
            }


            setFormErrors(errors);
            addToast(validationToast);
            return;
        }
        setFormErrors(initFormErrors);


        let newToast: Toast = {
            id: generateUID(),
            message: `فیلترها با موفقیت اعمال شدند.`,
            type: 'success',
        }

        applyFilters(filters, event.id);

        addToast(newToast);
        onClose();
    }


    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl">
                    <ModalHeader title="فیلتر" onClose={onClose} />

                    <div className="p-5 flex flex-col gap-y-4">

                        <div className="flex flex-col gap-y-2">
                            <span className={`text-base ${formErrors.type ? 'text-red-500' : 'text-indigo-900'} capitalize`}>نوع</span>

                            <div className="grid grid-cols-3 bg-gray-200 rounded-full">
                                <span onClick={selectType.bind(null, 'expend')} className={`col-span-1 text-center text-sm rounded-full py-3 cursor-pointer ${filters.type === 'expend' ? 'bg-indigo-800 text-white' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'} transition-all duration-300`}>هزینه</span>
                                <span onClick={selectType.bind(null, 'transfer')} className={`col-span-1 text-center text-sm rounded-full py-3 cursor-pointer ${filters.type === 'transfer' ? 'bg-indigo-800 text-white' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'} transition-all duration-300`}>جابجایی پول</span>
                                <span onClick={selectType.bind(null, 'any')} className={`col-span-1 text-center text-sm rounded-full py-3 cursor-pointer ${filters.type === 'any' ? 'bg-indigo-800 text-white' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'} transition-all duration-300`}>هر دو</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <span className={`text-base ${formErrors.group ? 'text-red-500' : 'text-indigo-900'} capitalize`}>فیلتر هزینه {"(0 - 1200000)"}</span>

                            <TextInput name="amount" value={filters.amountMin} error={formErrors.amountMin} label="از (تومان)" handleChange={changeAmountMinHandler} />
                            <TextInput name="amount" value={filters.amountMax} error={formErrors.amountMax} label="تا (تومان)" handleChange={changeAmountMaxHandler} />
                        </div>


                        <PRangeDatePicker
                            name="date"
                            values={filters.dateRange}
                            label="بازه تاریخی"
                            onChange={(dates) => setFilters((prevState: ExpenseFilters) => ({ ...prevState, dateRange: dates.map(date => date.toDate()) as [Date, Date] }))}
                            error={formErrors.dateRange}
                        />

                        {filters.type === 'expend' && (
                            <>
                                <MemberSelector
                                    label="کی پرداخت کرده؟"
                                    members={event.group}
                                    onSelect={togglePayer}
                                    value={filters.payer}
                                    error={formErrors.payer}
                                />
                                <MemberSelector
                                    label="کیا سهیم بودن؟"
                                    members={event.group}
                                    onSelect={toggleGroupMember}
                                    value={filters.group}
                                    error={formErrors.group}
                                    selectAllOption={true}
                                />
                            </>
                        )}

                        {filters.type === 'transfer' && (
                            <>
                                <MemberSelector
                                    label="مبداء"
                                    members={event.group}
                                    onSelect={toggleFrom}
                                    value={filters.from}
                                    error={formErrors.from}
                                    disalllows={filters.to.length > 0 ? [filters.to] : []}
                                />
                                <MemberSelector
                                    label="مقصد"
                                    members={event.group}
                                    onSelect={toggleTo}
                                    value={filters.to}
                                    error={formErrors.to}
                                    disalllows={filters.from.length > 0 ? [filters.from] : []}
                                />
                            </>
                        )}





                    </div>

                    <div className="p-5 flex justify-end">
                        <Button
                            text="فیلتر کن"
                            icon={<Filter className="size-5" />}
                            onClick={handleFilterExpenses}
                            size="medium"
                            color="accent"
                            type="button"
                        />
                    </div>

                </section>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default FiltersModal;