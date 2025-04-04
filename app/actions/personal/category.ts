// actions/personal.ts
'use server'

import { CreateCategoryRequest, UpdateCategoryRequest, DeleteCategoryRequest } from "@/types/requests/personal/category";
import { CreateCategoryResponse, UpdateCategoryResponse, DeleteCategoryResponse } from "@/types/responses/personal/category";
import { cookies } from "next/headers";

export async function createCategoryReq(inputs: CreateCategoryRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/categories`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: CreateCategoryResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                category: data.data, // Matches CategoryController response
                message: 'دسته‌بندی با موفقیت ایجاد شد',
            };
        }

        return {
            success: false,
            message: data?.message || response.statusText,
        };
    } catch {
        return {
            success: false,
            message: 'خطای سرور',
        };
    }
}

export async function updateCategoryReq(inputs: UpdateCategoryRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/categories/${inputs.id}`, {
            method: 'POST',
            body: JSON.stringify({ name: inputs.name, _method: 'PUT' }),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: UpdateCategoryResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                category: data.data,
                message: 'دسته‌بندی با موفقیت بروزرسانی شد',
            };
        }

        return {
            success: false,
            message: data?.message || response.statusText,
        };
    } catch {
        return {
            success: false,
            message: 'خطای سرور',
        };
    }
}

export async function deleteCategoryReq(inputs: DeleteCategoryRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/categories/${inputs.id}`, {
            method: 'POST',
            body: JSON.stringify({ _method: 'DELETE' }),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: DeleteCategoryResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                message: 'دسته‌بندی با موفقیت حذف شد',
            };
        }

        return {
            success: false,
            message: data?.message || response.statusText,
        };
    } catch {
        return {
            success: false,
            message: 'خطای سرور',
        };
    }
}