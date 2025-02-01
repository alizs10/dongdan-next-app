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


    // const addToast = useToastStore(state => state.addToast)
    // const { applyFilters, eventData, expenses } = useContext(EventContext)

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


    // function selectType(type: ExpenseFilters['type']) {

    //     const newFiltersState = type === 'transfer' ? { ...initTransferFilters, type } :
    //         type === 'expend' ? { ...initExpendFilter, type }
    //             : { ...initAnyFilters, type }

    //     setFilters(newFiltersState);
    // }

    // function toggleGroupMember(id: string) {

    //     if (filters.type !== 'expend') return

    //     if (id === 'all' && filters.type === 'expend') {
    //         setFilters((prev) => ({ ...prev, contributors: (prev.type === 'expend' && prev.contributors.length === event.members.length) ? [] : event.members.map(m => m.id.toString()) }))
    //         return
    //     }

    //     setFilters(prev => prev.type === 'expend' ? ({ ...prev, contributors: prev.contributors.includes(id) ? prev.contributors.filter(mId => mId.toString() !== id) : [...prev.contributors, id] }) : prev)
    // }

    // function togglePayer(id: string) {
    //     if (filters.type !== 'expend') return
    //     setFilters(prev => prev.type === 'expend' ? ({ ...prev, payer_id: prev.payer_id === id ? '' : id }) : prev)
    // }

    // function toggleTransmitter(id: string) {
    //     if (filters.type !== 'transfer') return

    //     if (id === filters.receiver_id) return

    //     setFilters(prev => prev.type === 'transfer' ? ({ ...prev, transmitter_id: prev.transmitter_id === id ? '' : id }) : prev)
    // }

    // function toggleReceiver(id: string) {
    //     if (filters.type !== 'transfer') return
    //     if (id === filters.transmitter_id) return
    //     setFilters(prev => prev.type === 'transfer' ? ({ ...prev, receiver_id: prev.receiver_id === id ? '' : id }) : prev)
    // }


    // function changeAmountMinHandler(e: React.ChangeEvent<HTMLInputElement>) {
    //     const regex = /^[0-9]+$/;
    //     const amount = e.target.value.replaceAll(',', '');

    //     if (amount.length > 0 && !regex.test(amount)) return;

    //     setFilters(prev => ({ ...prev, amountMin: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))

    // }

    // function changeAmountMaxHandler(e: React.ChangeEvent<HTMLInputElement>) {
    //     const regex = /^[0-9]+$/;
    //     const amount = e.target.value.replaceAll(',', '');

    //     if (amount.length > 0 && !regex.test(amount)) return;

    //     setFilters(prev => ({ ...prev, amountMax: amount.length > 0 ? TomanPriceFormatter(amount) : '' }))

    // }


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
                                            name="amountMin"
                                            type="text"
                                            className=" w-full"
                                            value={'0'}
                                            handleChange={() => { }}
                                        />

                                    </div>
                                </div>

                                <div className="w-[40%] grid grid-cols-6 items-center gap-x-2">
                                    <div className="col-span-1">تا</div>
                                    <div className="col-span-5">
                                        <FiltersTextInput
                                            name="amountMax"
                                            type="text"
                                            className=" w-full"
                                            value={'0'}
                                            handleChange={() => { }}
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
                                values={[new Date, new Date]}
                                onChange={(dates) => { }}
                            // error={formErrors.dateRange}
                            />
                        )}


                        {type === 'expend' && (
                            <>
                                <ToggleFilters label="پرداخت کننده" filterStatus={filtersStatus.payer_id} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'payer_id')} />

                                {filtersStatus.payer_id && (
                                    <MemberSelector

                                        label="کی پرداخت کرده؟"
                                        members={event.members}
                                        onSelect={() => { }}
                                        value={''}
                                        error={''}

                                    />
                                )}


                                <ToggleFilters label="مشارکت کنندگان" filterStatus={filtersStatus.contributor_ids} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'contributor_ids')} />

                                {filtersStatus.contributor_ids && (
                                    <MemberSelector
                                        label="کیا سهیم بودن؟"
                                        members={event.members}
                                        onSelect={() => { }}
                                        value={''}
                                        error={''}
                                        selectAllOption={true}
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
                                        onSelect={() => { }}
                                        value={''}
                                        error={''}
                                    // disalllows={filters.receiver_id.length > 0 ? [filters.receiver_id] : []}
                                    />
                                )}

                                <ToggleFilters label="دریافت کننده" filterStatus={filtersStatus.receiver_id} toggleFiltersStatus={toggleFiltersStatus.bind(null, 'receiver_id')} />
                                {filtersStatus.receiver_id && (
                                    <MemberSelector
                                        // label="مقصد"
                                        members={event.members}
                                        onSelect={() => { }}
                                        value={''}
                                        error={''}
                                    // disalllows={filters.transmitter_id.length > 0 ? [filters.transmitter_id] : []}
                                    />

                                )}
                            </>
                        )}

                    </div>




                    <div className="p-5 flex justify-end">
                        <Button
                            text="فیلتر کن"
                            icon={<Filter className="size-5" />}
                            // onClick={handleFilterExpenses}
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