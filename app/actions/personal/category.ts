// actions/personal.ts
'use server'

import { CreateCategoryRequest } from "@/types/requests/personal/category";
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

        const data = await response.json();

        console.log(data)

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