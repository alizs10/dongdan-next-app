'use client'

import React from 'react';
import { Category } from '@/types/personal/category-types';

type CategorySelectorProps = {
    categories: Category[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    error?: string;
    label?: string;
    multiSelect?: boolean;
};

export default function CategorySelector({
    categories,
    selectedIds,
    onChange,
    error,
    label = 'دسته‌بندی‌ها',
    multiSelect = true
}: CategorySelectorProps) {

    function handleSelect(categoryId: string) {
        if (selectedIds.includes(categoryId)) {
            // Deselect category
            onChange(selectedIds.filter(id => id !== categoryId));
        } else {
            if (multiSelect) {
                // Add to selected categories
                onChange([...selectedIds, categoryId]);
            } else {
                // Replace selected category (single select)
                onChange([categoryId]);
            }
        }
    }

    if (categories.length === 0) return null;

    return (
        <div className="w-full flex flex-col gap-y-1">
            <label className="text-base primary_text_color capitalize">{label}</label>
            <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className={`px-4 py-2 rounded-lg border cursor-pointer transition-all duration-300 ${selectedIds.includes(category.id.toString())
                                ? 'primary_bg_color text-white'
                                : 'app_bg_color app_border_color app_text_color'
                            }`}
                        onClick={() => handleSelect(category.id.toString())}
                    >
                        {category.name}
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