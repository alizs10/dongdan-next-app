'use server'

import { CreateBudgetLimitRequest, UpdateBudgetLimitRequest, DeleteBudgetLimitRequest } from "@/types/requests/personal/budget-limit";
import { CreateBudgetLimitResponse, UpdateBudgetLimitResponse, DeleteBudgetLimitResponse } from "@/types/responses/personal/budget-limit";
import { cookies } from "next/headers";

export async function createBudgetLimitReq(inputs: CreateBudgetLimitRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/limits`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: CreateBudgetLimitResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                budgetLimit: data.data,
                message: 'محدودیت بودجه با موفقیت ایجاد شد',
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

export async function updateBudgetLimitReq(inputs: UpdateBudgetLimitRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/limits/${inputs.id}`, {
            method: 'PUT',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: UpdateBudgetLimitResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                budgetLimit: data.data,
                message: 'محدودیت بودجه با موفقیت ویرایش شد',
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

export async function deleteBudgetLimitReq(inputs: DeleteBudgetLimitRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/limits/${inputs.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: DeleteBudgetLimitResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                message: 'محدودیت بودجه با موفقیت حذف شد',
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