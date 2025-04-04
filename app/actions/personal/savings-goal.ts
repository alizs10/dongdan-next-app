'use server'

import { CreateSavingsGoalRequest, UpdateSavingsGoalRequest, DeleteSavingsGoalRequest } from "@/types/requests/personal/savings-goal";
import { CreateSavingsGoalResponse, UpdateSavingsGoalResponse, DeleteSavingsGoalResponse } from "@/types/responses/personal/savings-goal";
import { cookies } from "next/headers";

export async function createSavingsGoalReq(inputs: CreateSavingsGoalRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/savings-goals`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: CreateSavingsGoalResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                savingsGoal: data.data,
                message: 'هدف پس‌انداز با موفقیت ایجاد شد',
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

export async function updateSavingsGoalReq(inputs: UpdateSavingsGoalRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/savings-goals/${inputs.id}`, {
            method: 'PUT',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: UpdateSavingsGoalResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                savingsGoal: data.data,
                message: 'هدف پس‌انداز با موفقیت ویرایش شد',
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

export async function deleteSavingsGoalReq(inputs: DeleteSavingsGoalRequest) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/savings-goals/${inputs.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: DeleteSavingsGoalResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                message: 'هدف پس‌انداز با موفقیت حذف شد',
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