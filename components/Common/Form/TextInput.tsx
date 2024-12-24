import { Ban } from "lucide-react";

type PropsTypes = {
    name: string,
    label: string,
    type?: string,
    hint?: string,
    inpRef?: React.RefObject<HTMLInputElement>, value: string | number,
    error?: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    inpProps?: React.InputHTMLAttributes<HTMLInputElement>,
    disabled?: boolean;
}

function TextInput({ name, label, type, hint, inpRef, value, error, handleChange, inpProps, disabled = false }: PropsTypes) {

    return (
        <div className={`w-full flex flex-col gap-y-1`}>

            <label className={`text-base ${disabled ? 'text-gray-300 dark:text-gray-700' : error ? 'text-red-500' : 'primary_text_color'} capitalize`}>{label}</label>

            <input
                type={type ?? 'text'}
                name={name}
                ref={inpRef}
                value={value ?? ''}
                onChange={handleChange}
                placeholder={"اینجا تایپ کنید..."}
                disabled={disabled}
                className={`rounded-xl px-5 py-2 border ${disabled ? 'border-gray-100 dark:border-gray-800' : error ? 'border-red-500' : 'app_border_color focus:border-indigo-800 dark:focus:border-indigo-600'} p-1 text-base bg-transparent focus:outline-none ${disabled ? 'text-gray-300 dark:text-gray-700 placeholder:text-gray-200 dark:placeholder:text-gray-800' : 'text-gray-700 dark:text-gray-300 placeholder:text-gray-600 dark:placeholder:text-gray-400'} transition-all duration-300 outline-none placeholder:text-base`}
                {...inpProps}
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

export default TextInput;