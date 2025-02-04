'use client'

import { AnyExpense, ExpenseFilters, Event } from "@/types/event-types";

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Filter } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { TomanPriceFormatter, TomanPriceToNumber } from "@/helpers/helpers";

import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import PRangeDatePicker from "@/components/Common/Form/PRangeDatePicker";
import { anyFilterSchema, expendFilterSchema, transferFilterSchema } from "@/database/validations/filters-validation";
import { EventContext } from "@/context/EventContext";

import { DateObject } from "react-multi-date-picker";
import { filterExpensesReq } from "@/app/actions/filter";
import useStore from "@/store/store";

type ExpendFilter = {
    payer_id: string;
    contributor_ids: string[];
}

type TransferFilter = {
    transmitter_id: string;
    receiver_id: string;
}

type AmountFilter = {
    min_amount: string;
    max_amount: string;
}

type DateFilter = {
    start_date: Date;
    end_date: Date;
}



function ToggleFilters({ label, filterStatus, toggleFiltersStatus }: { label: string, filterStatus: boolean, toggleFiltersStatus: () => void }) {


    return (
        <div className="flex flex-row items-center justify-between">
            <label className="text-base primary_text_color" htmlFor="type">{label}</label>


            <div className="grid grid-cols-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                <button onClick={toggleFiltersStatus} className={`col-span-1 text-center text-sm rounded-full py-2 ${filterStatus ? 'bg-indigo-800 dark:bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900'} transition-all duration-300`}>فعال</button>
                <button onClick={toggleFiltersStatus} className={`col-span-1 text-center text-sm rounded-full py-2 px-5 ${!filterStatus ? 'bg-indigo-800 dark:bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900'} transition-all duration-300`}>غیرفعال</button>
            </div>
        </div>

    )
}

function FiltersTextInput({ name, type, className, value, handleChange }: { name: string, type: string, className: string, value: string, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <input
            name={name}
            type={type}
            className={'rounded-xl px-5 py-2 border app_border_color focus:border-indigo-800 dark:focus:border-indigo-600 p-1 text-base bg-transparent focus:outline-none text-gray-700 dark:text-gray-300 placeholder:text-gray-600 dark:placeholder:text-gray-400 transition-all duration-300 outline-none placeholder:text-base' + className}
            value={value}
            onChange={handleChange}
        />
    )
}


function NewFiltersModal({ onClose, event }: { onClose: () => void, event: Event }) {


    const { user } = useStore()

    const [cursor, setCursor] = useState<string | null>(null)
    const [nextCursorId, setNextCursorId] = useState<number | null>(null)

    const { addToast } = useStore()
    const { applyFilters } = useContext(EventContext)


    const [amountFilters, setAmountFilters] = useState<AmountFilter>({
        min_amount: '',
        max_amount: '',
    })

    const [dateFilters, setDateFilters] = useState<DateFilter>({
        start_date: new Date(event.start_date),
        end_date: new Date(),
    })

    const [expendFilters, setExpendFilters] = useState<ExpendFilter>({
        payer_id: '',
        contributor_ids: [],
    })

    const [transferFilters, setTransferFilters] = useState<TransferFilter>({
        transmitter_id: '',
        receiver_id: '',
    })

    const [filtersStatus, setFiltersStatus] = useState({
        type: true,
        amount: false,
        date: false,
        payer_id: false,

        contributor_ids: false,
        transmitter_id: false,
        receiver_id: false,
    })

    const toggleFiltersStatus = (key: keyof typeof filtersStatus) => {
        setFiltersStatus(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const [type, setType] = useState<'expend' | 'transfer' | 'any'>('any')

    const selectType = (type: ExpenseFilters['type']) => {
        setType(type)
    }

    const tommorowDate = new Date();


    tommorowDate.setDate(tommorowDate.getDate() + 1);

    function togglePayer(id: string) {
        if (type !== 'expend' || !filtersStatus.payer_id) return
        setExpendFilters(prev => ({ ...prev, payer_id: prev.payer_id === id ? '' : id }))
    }

    function toggleAllContributors() {

        if (expendFilters.contributor_ids.length === event.members.length) {
            setExpendFilters(prev => ({ ...prev, contributor_ids: [] }))
            return
        }
        setExpendFilters(prev => ({ ...prev, contributor_ids: event.members.map(m => m.id.toString()) ?? [] }))
    }


    function isMemberContributor(memberId: string) {
        return expendFilters.contributor_ids.some(c => c === memberId);
    }


    function toggleContributor(actionKey: string) {

        if (type !== 'expend' || !filtersStatus.contributor_ids) return

        if (actionKey === 'all') {
            toggleAllContributors()
            return
        }

        if (isMemberContributor(actionKey)) {
            setExpendFilters(prev => ({ ...prev, contributor_ids: prev.contributor_ids.filter(c => c !== actionKey) }))
        } else {
            setExpendFilters(prev => ({ ...prev, contributor_ids: [...prev.contributor_ids, actionKey] }))
        }

    }

    function toggleTransmitter(id: string) {

        if ((type !== 'transfer' || !filtersStatus.transmitter_id) || (filtersStatus.receiver_id && id === transferFilters.receiver_id)) return
        setTransferFilters(prev => ({ ...prev, transmitter_id: prev.transmitter_id === id ? '' : id }))
    }

    function toggleReceiver(id: string) {
        if ((type !== 'transfer' || !filtersStatus.receiver_id) || (filtersStatus.transmitter_id && id === transferFilters.transmitter_id)) return
        setTransferFilters(prev => ({ ...prev, receiver_id: prev.receiver_id === id ? '' : id }))
    }


    function changemin_amountHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        const amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setAmountFilters(prev => ({ ...prev, min_amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))
    }


    function changeAmountMaxHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]+$/;
        const amount = e.target.value.replaceAll(',', '');

        if (amount.length > 0 && !regex.test(amount)) return;

        setAmountFilters(prev => ({ ...prev, max_amount: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))
    }

    function handleDateRangeChange(dates: [Date, Date]) {
        // (dates) => setFilters((prevState: ExpenseFilters) => ({ ...prevState, dateRange: dates.map(date => date.toDate()) as [Date, Date] }))
        // console.log(dates)
        setDateFilters({ start_date: dates[0], end_date: dates[1] })
    }

    const [errors, setErrors] = useState({
        min_amount: '',
        max_amount: '',
        dateRange: '',
        payer_id: '',
        contributor_ids: '',
        transmitter_id: '',
        receiver_id: '',
    })

    async function handleApplyFilter() {

        const filtersQuery = new URLSearchParams({
            type: type,
            ...((filtersStatus.amount && amountFilters.min_amount) && { min_amount: TomanPriceToNumber(amountFilters.min_amount).toString() }),
            ...((filtersStatus.amount && amountFilters.max_amount) && { max_amount: TomanPriceToNumber(amountFilters.max_amount).toString() }),
            ...((filtersStatus.date && dateFilters.start_date) && { start_date: dateFilters.start_date.toISOString() }),
            ...((filtersStatus.date && dateFilters.end_date) && { end_date: dateFilters.end_date.toISOString() }),
            ...((filtersStatus.payer_id && expendFilters.payer_id) && { payer_id: expendFilters.payer_id }),
            ...((filtersStatus.contributor_ids && expendFilters.contributor_ids.length > 0) && { contributor_ids: expendFilters.contributor_ids.join(',') }),
            ...((filtersStatus.transmitter_id && transferFilters.transmitter_id) && { transmitter_id: transferFilters.transmitter_id }),
            ...((filtersStatus.receiver_id && transferFilters.receiver_id) && { receiver_id: transferFilters.receiver_id }),
            limit: '10',
            ...(cursor && { cursor }),
            ...(nextCursorId && { cursor_id: nextCursorId.toString() })

        });

        applyFilters(filtersQuery.toString())
        addToast({
            message: `فیلترها با موفقیت اعمال شدند.`,
            type: 'success' as const,
        })
        onClose()


    }


    // function handleFilterExpenses() {


    //     const validationSchema = filters.type === 'any' ? anyFilterSchema : filters.type === 'expend' ? expendFilterSchema : transferFilterSchema;

    //     const { errors, hasError } = zValidate(validationSchema, filters);

    //     if (hasError) {

    //         const validationToast = {
    //             message: `فرم فیلتر ها نامعتبر است.`,
    //             type: 'danger' as const,
    //         }


    //         addToast(validationToast);
    //         setFormErrors(errors);
    //         return;
    //     }
    //     setFormErrors(initFormErrors);


    //     const newToast = {

    //         message: `فیلترها با موفقیت اعمال شدند.`,
    //         type: 'success' as const,
    //     }

    //     applyFilters(filters);

    //     addToast(newToast);
    //     onClose();
    // }


    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title="فیلتر" onClose={onClose} />

                    <div className="p-5 flex flex-col gap-y-4">

                        <div className="flex flex-row justify-between items-center">
                            <label className="text-base primary_text_color" htmlFor="type">فیلتر نوع</label>
                            <div className="grid grid-cols-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                                <button onClick={selectType.bind(null, 'expend')} className={`col-span-1 text-center text-sm rounded-full py-2 ${type === 'expend' ? 'bg-indigo-800 dark:bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900'} transition-all duration-300`}>هزینه</button>
                                <button onClick={selectType.bind(null, 'transfer')} className={`col-span-1 text-center text-sm rounded-full py-2 px-5 ${type === 'transfer' ? 'bg-indigo-800 dark:bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900'} transition-all duration-300`}>جابجایی پول</button>

                                <button onClick={selectType.bind(null, 'any')} className={`col-span-1 text-center text-sm rounded-full py-2 cursor-pointer ${type === 'any' ? 'bg-indigo-800 dark:bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900'} transition-all duration-300`}>هر دو</button>
                            </div>
                        </div>


                        <ToggleFilters label="قیمت" filterStatus={filtersStatus.amount} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'amount')} />

                        {filtersStatus.amount && (
                            <div className="flex flex-row flex-nowrap justify-evenly items-center gap-x-4">

                                <div className="w-[40%] grid grid-cols-6 items-center gap-x-2">
                                    <div className="col-span-1">از</div>
                                    <div className="col-span-5">
                                        <FiltersTextInput
                                            name="min_amount"
                                            type="text"
                                            className=" w-full"
                                            value={amountFilters.min_amount}
                                            handleChange={changemin_amountHandler}
                                        />


                                    </div>
                                </div>

                                <div className="w-[40%] grid grid-cols-6 items-center gap-x-2">
                                    <div className="col-span-1">تا</div>
                                    <div className="col-span-5">
                                        <FiltersTextInput
                                            name="max_amount"
                                            type="text"
                                            className=" w-full"
                                            value={amountFilters.max_amount}
                                            handleChange={changeAmountMaxHandler}
                                        />


                                    </div>
                                </div>


                                <div className="w-[15%]">
                                    <span className="block text-end">تومان</span>
                                </div>
                            </div>
                        )}

                        <ToggleFilters label="تاریخ" filterStatus={filtersStatus.date} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'date')} />

                        {filtersStatus.date && (
                            <PRangeDatePicker
                                name="date"
                                values={[dateFilters.start_date, dateFilters.end_date]}
                                onChange={(dates) => handleDateRangeChange(dates.map(date => date.toDate()) as [Date, Date])}
                                minDate={new DateObject(event.start_date)}
                                maxDate={new DateObject()}


                                hint="تاریخ باید بین تاریخ شروع رویداد و تاریخ امروز باشد."
                            />

                        )}


                        {type === 'expend' && (
                            <>
                                <ToggleFilters label="پرداخت کننده" filterStatus={filtersStatus.payer_id} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'payer_id')} />

                                {filtersStatus.payer_id && (
                                    <MemberSelector

                                        label="کی پرداخت کرده؟"
                                        members={event.members}
                                        onSelect={togglePayer}
                                        value={(type !== 'expend' || !filtersStatus.payer_id) ? '' : expendFilters.payer_id}
                                        error={''}
                                    />
                                )}


                                <ToggleFilters label="مشارکت کنندگان" filterStatus={filtersStatus.contributor_ids} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'contributor_ids')} />

                                {(user && filtersStatus.contributor_ids) && (
                                    <MemberSelector
                                        label="کیا سهیم بودن؟"
                                        members={event.members}
                                        onSelect={toggleContributor}
                                        value={(type !== 'expend' || !filtersStatus.contributor_ids) ? [] : expendFilters.contributor_ids}
                                        error={''}
                                        selectAllOption={true}
                                        self={{
                                            id: user.id.toString(),
                                            scheme: user.scheme,
                                            include: false
                                        }}
                                    />
                                )}
                            </>
                        )}



                        {type === 'transfer' && (
                            <>
                                <ToggleFilters label="ارسال کننده" filterStatus={filtersStatus.transmitter_id} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'transmitter_id')} />

                                {filtersStatus.transmitter_id && (
                                    <MemberSelector
                                        // label="مبداء"
                                        members={event.members}
                                        onSelect={toggleTransmitter}
                                        value={(type !== 'transfer' || !filtersStatus.transmitter_id) ? '' : transferFilters.transmitter_id}
                                        error={''}
                                        disalllows={transferFilters.receiver_id.length > 0 ? [transferFilters.receiver_id] : []}
                                    />
                                )}

                                <ToggleFilters label="دریافت کننده" filterStatus={filtersStatus.receiver_id} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'receiver_id')} />
                                {filtersStatus.receiver_id && (
                                    <MemberSelector
                                        // label="مقصد"
                                        members={event.members}
                                        onSelect={toggleReceiver}
                                        value={(type !== 'transfer' || !filtersStatus.receiver_id) ? '' : transferFilters.receiver_id}
                                        error={''}
                                        disalllows={transferFilters.transmitter_id.length > 0 ? [transferFilters.transmitter_id] : []}
                                    />



                                )}
                            </>
                        )}

                    </div>




                    <div className="p-5 flex justify-end">
                        <Button
                            text="فیلتر کن"
                            icon={<Filter className="size-5" />}
                            onClick={handleApplyFilter}
                            size="medium"
                            color="accent"
                            type="button"

                        />
                    </div>

                </section>

            </ModalWrapper >
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default NewFiltersModal;