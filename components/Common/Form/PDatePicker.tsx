import { Ban } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker, { CustomComponentProps, DateObject, DatePickerProps, DatePickerRef, Value } from "react-multi-date-picker";
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import useClickOutside from "@/hooks/useOutsideClick";

type PropsTypes = {
    name: string,
    label: string,
    hint?: string,
    value: Date,
    error?: string,
    onChange: (dateObj: DateObject) => void,
    inpProps?: React.InputHTMLAttributes<HTMLInputElement>,
}

type CustomInputProps = CustomComponentProps & {
    error?: string
}



function CustomInput({ onFocus, value, onChange, error }: CustomInputProps) {

    return <input
        onFocus={onFocus}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl px-5 py-2 border ${error ? 'border-red-500' : 'border-gray-200 focus:border-indigo-900'} p-1 text-base bg-transparent focus:outline-none text-gray-700 transition-all duration-300 outline-none placeholder:text-base`}
    />
}

function PDatePicker({ name, label, value, onChange, error, hint }: PropsTypes) {


    const datePickerRef = useClickOutside<DatePickerRef>(() => datePickerRef.current?.closeCalendar())

    return (
        <div className={`w-full flex flex-col gap-y-1`}>

            <label className={`text-base ${error ? 'text-red-500' : 'text-indigo-900'} capitalize`}>{label}</label>

            <DatePicker
                render={<CustomInput error={error} />}
                value={value}
                onChange={onChange}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                ref={datePickerRef}
                name={name}
            />

            {error && (
                <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                    <Ban className="size-3.5" />
                    <span>{error}</span>
                </div>
            )}
            {hint && (
                <p className="text-xs text-slate-500 dark:text-slate-400">&#x2022; {hint}</p>
            )}

        </div>
    );
}

export default PDatePicker;