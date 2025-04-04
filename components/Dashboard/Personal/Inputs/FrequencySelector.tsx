'use client'

import React from 'react';

export type FrequencyOption = {
    value: 'daily' | 'weekly' | 'monthly' | 'yearly';
    label: string;
};

export const frequencyOptions: FrequencyOption[] = [
    { value: 'daily', label: 'روزانه' },
    { value: 'weekly', label: 'هفتگی' },
    { value: 'monthly', label: 'ماهانه' },
    { value: 'yearly', label: 'سالانه' },
];

type FrequencySelectorProps = {
    value: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
    onChange: (value: 'daily' | 'weekly' | 'monthly' | 'yearly' | null) => void;
    error?: string;
    label?: string;
};

export default function FrequencySelector({
    value,
    onChange,
    error,
    label = 'تکرار'
}: FrequencySelectorProps) {

    function handleSelect(frequencyValue: 'daily' | 'weekly' | 'monthly' | 'yearly') {
        // If the same frequency is clicked, toggle it off
        if (value === frequencyValue) {
            onChange(null);
        } else {
            // Otherwise, set the new frequency
            onChange(frequencyValue);
        }
    }

    return (
        <div className="w-full flex flex-col gap-y-1">
            <label className="text-base primary_text_color capitalize">{label}</label>
            <div className="flex flex-wrap gap-2 mt-2">
                {frequencyOptions.map(option => (
                    <div
                        key={option.value}
                        className={`px-4 py-2 rounded-lg border cursor-pointer transition-all duration-300 ${value === option.value
                                ? 'primary_bg_color text-white'
                                : 'app_bg_color app_border_color app_text_color'
                            }`}
                        onClick={() => handleSelect(option.value)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
            {error && (
                <div className="flex gap-x-2 items-center mt-2 text-sm text-red-500">
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
} 