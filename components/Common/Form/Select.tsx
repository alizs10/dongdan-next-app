'use client'

import React from 'react'

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    name: string;
    value: string;
    error?: string;
    label: string;
    options: SelectOption[];
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({ name, value, error, label, options, handleChange }: SelectProps) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                className={`app_bg_color border app_border_color rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${error ? 'border-red-500 dark:border-red-400' : ''}`}
            >
                <option value="">انتخاب {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className="text-sm text-red-500 dark:text-red-400">
                    {error}
                </span>
            )}
        </div>
    )
} 