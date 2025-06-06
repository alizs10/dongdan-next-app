import { Ban } from "lucide-react";
import DatePicker, { CustomComponentProps, DateObject, DatePickerRef } from "react-multi-date-picker";
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import useClickOutside from "@/hooks/useOutsideClick";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { useTheme } from "next-themes";

type PropsTypes = {
    name: string,
    label: string,
    hint?: string,
    value: Date,
    error?: string,
    onChange: (dateObj: DateObject) => void,
    inpProps?: React.InputHTMLAttributes<HTMLInputElement>,
    maxDate?: Date,
    minDate?: Date, // Added minDate
}

type CustomInputProps = CustomComponentProps & {
    error?: string
}

function CustomInput({ onFocus, value, onChange, error }: CustomInputProps) {
    return <input
        onFocus={onFocus}
        value={value}
        onChange={onChange}
        readOnly
        className={`rounded-xl w-full px-5 py-2 border ${error ? 'border-red-500' : 'app_border_color focus:border-indigo-800 dark:focus:border-indigo-600'} p-1 text-base bg-transparent focus:outline-none text-gray-700 dark:text-gray-300 placeholder:text-gray-600 dark:placeholder:text-gray-400 transition-all duration-300 outline-none placeholder:text-base`}
    />
}

function PDatePicker({ name, label, value, onChange, error, hint, maxDate, minDate }: PropsTypes) { // Added minDate to props
    const { theme } = useTheme()

    const datePickerRef = useClickOutside<DatePickerRef>(() => datePickerRef.current?.closeCalendar())

    return (
        <div className={`w-full flex flex-col gap-y-1`}>
            <label className={`text-base ${error ? 'text-red-500' : 'primary_text_color'} capitalize`}>{label}</label>

            <DatePicker
                className={theme === 'dark' ? 'bg-dark' : ''}
                render={<CustomInput error={error} />}
                value={value}
                onChange={onChange}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                ref={datePickerRef}
                name={name}
                maxDate={maxDate}
                minDate={minDate} // Passed minDate to DatePicker
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
