'use client'

import TextInput from "@/components/Common/Form/TextInput";
import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { zValidate } from "@/helpers/validation-helper";
import { Ban, Check, Filter, Save, User } from "lucide-react";
import { useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { SCHEMES } from "@/database/data/schemes";
import { useParams } from "next/navigation";
import { personSchema } from "@/database/validations/person-validation";
import { useEventStore } from "@/store/event-store";
import { generateUID, TomanPriceFormatter } from "@/helpers/helpers";
import { Event, SchemeType } from "@/types/event-types";
import { Toast, useToastStore } from "@/store/toast-store";
import Button from "@/components/Common/Button";
import MemberSelector from "@/components/Common/Form/MemberSelector";
import PRangeDatePicker from "@/components/Common/Form/PRangeDatePicker";

type Filters = {
    type: 'any' | 0 | 1;
    group: string[];
    payer: string;
    from: string;
    to: string;
    amountMin: string;
    amountMax: string;
    dateRange: [Date, Date];
}

function FiltersModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const addToast = useToastStore(state => state.addToast)

    const initFilters: Filters = {
        type: 'any',
        group: [],
        payer: '',
        from: '',
        to: '',
        amountMin: '',
        amountMax: '',
        dateRange: [new Date(Date.now()), new Date(Date.now())]
    }
    const [filters, setFilters] = useState(initFilters);


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

    function selectType(type: 'any' | 0 | 1) {
        setFilters(prev => ({ ...prev, type }))
    }

    function toggleGroupMember(id: string) {
        if (id === 'all') {
            setFilters(prev => ({ ...prev, group: prev.group.length === event.group.length ? [] : event.group.map(m => m.id) }))
            return
        }
        setFilters(prev => ({ ...prev, group: prev.group.includes(id) ? prev.group.filter(mId => mId !== id) : [...prev.group, id] }))
    }

    function togglePayer(id: string) {
        setFilters(prev => ({ ...prev, payer: prev.payer === id ? '' : id }))
    }
    function toggleFrom(id: string) {
        if (id === filters.to) return
        setFilters(prev => ({ ...prev, from: prev.from === id ? '' : id }))
    }
    function toggleTo(id: string) {
        if (id === filters.from) return
        setFilters(prev => ({ ...prev, to: prev.to === id ? '' : id }))
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

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl">
                    <ModalHeader title="فیلتر" onClose={onClose} />

                    <div className="p-5 flex flex-col gap-y-4">

                        <div className="flex flex-col gap-y-2">
                            <span className={`text-base ${formErrors.type ? 'text-red-500' : 'text-indigo-900'} capitalize`}>نوع</span>

                            <div className="grid grid-cols-3 bg-gray-200 rounded-full">
                                <span onClick={selectType.bind(null, 0)} className={`col-span-1 text-center text-sm rounded-full py-3 cursor-pointer ${filters.type === 0 ? 'bg-indigo-800 text-white' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'} transition-all duration-300`}>هزینه</span>
                                <span onClick={selectType.bind(null, 1)} className={`col-span-1 text-center text-sm rounded-full py-3 cursor-pointer ${filters.type === 1 ? 'bg-indigo-800 text-white' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'} transition-all duration-300`}>جابجایی پول</span>
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
                            onChange={(dates) => setFilters((prevState: Filters) => ({ ...prevState, dateRange: dates.map(date => date.toDate()) as [Date, Date] }))}
                            error={formErrors.dateRange}
                        />

                        {filters.type === 0 && (
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

                        {filters.type === 1 && (
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
                            icon={<Check className="size-5" />}
                            onClick={() => { }}
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