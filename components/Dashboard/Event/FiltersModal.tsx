'use client'

import { AnyExpense, ExpendFilter, ExpenseFilters, TransferFilter, Event } from "@/types/event-types";

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Filter } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { TomanPriceFormatter } from "@/helpers/helpers";
import { useToastStore } from "@/store/toast-store";
import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import PRangeDatePicker from "@/components/Common/Form/PRangeDatePicker";
import { anyFilterSchema, expendFilterSchema, transferFilterSchema } from "@/database/validations/filters-validation";
import { EventContext } from "@/context/EventContext";

function FiltersModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const addToast = useToastStore(state => state.addToast)
    const { applyFilters } = useContext(EventContext)


    const tommorowDate = new Date();
    tommorowDate.setDate(tommorowDate.getDate() + 1);

    const initAnyFilters: AnyExpense = {
        type: 'any',
        amountMin: '',
        amountMax: '',
        dateRange: [new Date(), tommorowDate]
    }
    const initExpendFilter: ExpendFilter = {
        type: 'expend',
        amountMin: '',
        amountMax: '',
        payer_id: '',
        contributors: [],
        dateRange: [new Date(), tommorowDate]
    }
    const initTransferFilters: TransferFilter = {
        type: 'transfer',
        amountMin: '',
        amountMax: '',
        transmitter_id: '',
        receiver_id: '',
        dateRange: [new Date(), tommorowDate]
    }

    const [filters, setFilters] = useState<ExpenseFilters>(initAnyFilters);


    const initFormErrors = useMemo(() => ({
        type: '',
        contributors: '',
        payer_id: '',
        transmitter_id: '',
        receiver_id: '',
        amountMin: '',
        amountMax: '',
        dateRange: ''
    }), [])

    const [formErrors, setFormErrors] = useState(initFormErrors);

    useEffect(() => {
        setFormErrors(initFormErrors)
    }, [filters.type, initFormErrors])

    function selectType(type: ExpenseFilters['type']) {

        const newFiltersState = type === 'transfer' ? { ...initTransferFilters, type } :
            type === 'expend' ? { ...initExpendFilter, type }
                : { ...initAnyFilters, type }

        setFilters(newFiltersState);
    }

    function toggleGroupMember(id: string) {

        if (filters.type !== 'expend') return

        if (id === 'all' && filters.type === 'expend') {
            setFilters((prev) => ({ ...prev, contributors: (prev.type === 'expend' && prev.contributors.length === event.members.length) ? [] : event.members.map(m => m.id.toString()) }))
            return
        }

        setFilters(prev => prev.type === 'expend' ? ({ ...prev, contributors: prev.contributors.includes(id) ? prev.contributors.filter(mId => mId.toString() !== id) : [...prev.contributors, id] }) : prev)
    }

    function togglePayer(id: string) {
        if (filters.type !== 'expend') return
        setFilters(prev => prev.type === 'expend' ? ({ ...prev, payer_id: prev.payer_id === id ? '' : id }) : prev)
    }

    function toggleTransmitter(id: string) {
        if (filters.type !== 'transfer') return

        if (id === filters.receiver_id) return

        setFilters(prev => prev.type === 'transfer' ? ({ ...prev, transmitter_id: prev.transmitter_id === id ? '' : id }) : prev)
    }
    function toggleReceiver(id: string) {
        if (filters.type !== 'transfer') return
        if (id === filters.transmitter_id) return
        setFilters(prev => prev.type === 'transfer' ? ({ ...prev, receiver_id: prev.receiver_id === id ? '' : id }) : prev)
    }


    function changeAmountMinHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        const amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setFilters(prev => ({ ...prev, amountMin: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))

    }

    function changeAmountMaxHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        const amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setFilters(prev => ({ ...prev, amountMax: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))

    }


    function handleFilterExpenses() {

        const validationSchema = filters.type === 'any' ? anyFilterSchema : filters.type === 'expend' ? expendFilterSchema : transferFilterSchema;

        const { errors, hasError } = zValidate(validationSchema, filters);

        if (hasError) {

            const validationToast = {
                message: `فرم فیلتر ها نامعتبر است.`,
                type: 'danger' as const,
            }


            addToast(validationToast);
            setFormErrors(errors);
            return;
        }
        setFormErrors(initFormErrors);


        const newToast = {

            message: `فیلترها با موفقیت اعمال شدند.`,
            type: 'success' as const,
        }

        applyFilters(filters);

        addToast(newToast);
        onClose();
    }


    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="فیلتر" onClose={onClose} />

                    <div className="p-5 flex flex-col gap-y-4">

                        <div className="flex flex-col gap-y-2">
                            <span className={`text-base ${formErrors.type ? 'text-red-500' : 'primary_text_color'} capitalize`}>نوع</span>

                            <div className="grid grid-cols-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                                <span onClick={selectType.bind(null, 'expend')} className={`col-span-1 text-center text-sm rounded-full py-3 cursor-pointer ${filters.type === 'expend' ? 'bg-indigo-800 dark:bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900'} transition-all duration-300`}>هزینه</span>
                                <span onClick={selectType.bind(null, 'transfer')} className={`col-span-1 text-center text-sm rounded-full py-3 cursor-pointer ${filters.type === 'transfer' ? 'bg-indigo-800 dark:bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900'} transition-all duration-300`}>جابجایی پول</span>
                                <span onClick={selectType.bind(null, 'any')} className={`col-span-1 text-center text-sm rounded-full py-3 cursor-pointer ${filters.type === 'any' ? 'bg-indigo-800 dark:bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900'} transition-all duration-300`}>هر دو</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <span className={`text-base ${formErrors.contributors ? 'text-red-500' : 'primary_text_color'} capitalize`}>فیلتر هزینه {"(0 - 1200000)"}</span>

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
                                    members={event.members}
                                    onSelect={togglePayer}
                                    value={filters.payer_id}
                                    error={formErrors.payer_id}
                                />
                                <MemberSelector
                                    label="کیا سهیم بودن؟"
                                    members={event.members}
                                    onSelect={toggleGroupMember}
                                    value={filters.contributors}
                                    error={formErrors.contributors}
                                    selectAllOption={true}
                                />
                            </>
                        )}

                        {filters.type === 'transfer' && (
                            <>
                                <MemberSelector
                                    label="مبداء"
                                    members={event.members}
                                    onSelect={toggleTransmitter}
                                    value={filters.transmitter_id}
                                    error={formErrors.transmitter_id}
                                    disalllows={filters.receiver_id.length > 0 ? [filters.receiver_id] : []}
                                />
                                <MemberSelector
                                    label="مقصد"
                                    members={event.members}
                                    onSelect={toggleReceiver}
                                    value={filters.receiver_id}
                                    error={formErrors.receiver_id}
                                    disalllows={filters.transmitter_id.length > 0 ? [filters.transmitter_id] : []}
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