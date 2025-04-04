'use server'

import { PersonalTransaction } from "@/types/personal-types";
import { CreateTransactionRequest, DeleteTransactionRequest, UpdateTransactionRequest } from "@/types/requests/personal/transaction";
import { CreateTransactionResponse, DeleteTransactionResponse, UpdateTransactionResponse } from "@/types/responses/personal/transaction";
import { cookies } from "next/headers";

export async function createTransactionReq(data: CreateTransactionRequest) {
    const token = (await cookies()).get('token');

    try {
        let convertedData = {
            ...data,
            is_recurring: data.is_recurring !== undefined ?
                (data.is_recurring === 1 ? 'true' : 'false') :
                undefined
        };

        // Remove frequency if is_recurring is 0
        if (data.is_recurring === 0 && 'frequency' in convertedData) {
            const { frequency, ...dataWithoutFrequency } = convertedData;
            convertedData = dataWithoutFrequency;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify(convertedData),
        });

        const responseData: CreateTransactionResponse = await res.json();

        console.log(responseData)

        if (res.ok && responseData.status) {
            return {
                success: true,
                transaction: responseData.data,
                message: 'تراکنش با موفقیت ایجاد شد',
            };
        }

        return {
            success: false,
            message: responseData?.message || res.statusText,
        };
    } catch {
        return {
            success: false,
            message: 'خطای سرور',
        };
    }
}

export async function updateTransactionReq(data: UpdateTransactionRequest) {
    const token = (await cookies()).get('token');

    try {
        let convertedData = {
            ...data,
            is_recurring: data.is_recurring !== undefined ?
                (data.is_recurring === 1 ? 'true' : 'false') :
                undefined,
            _method: 'PUT'
        };

        // Remove frequency if is_recurring is 0
        if (data.is_recurring === 0 && 'frequency' in convertedData) {
            const { frequency, ...dataWithoutFrequency } = convertedData;
            convertedData = dataWithoutFrequency;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/transactions/${data.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify(convertedData),
        });

        const responseData: UpdateTransactionResponse = await res.json();

        if (res.ok && responseData.status) {
            return {
                success: true,
                transaction: responseData.data,
                message: 'تراکنش با موفقیت بروزرسانی شد',
            };
        }

        return {
            success: false,
            message: responseData?.message || res.statusText,
        };
    } catch {
        return {
            success: false,
            message: 'خطای سرور',
        };
    }
}

export async function deleteTransactionReq(data: DeleteTransactionRequest) {
    const token = (await cookies()).get('token');

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/transactions/${data.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify({ _method: 'DELETE' }),
        });

        const responseData: DeleteTransactionResponse = await res.json();

        if (res.ok && responseData.status) {
            return {
                success: true,
                message: 'تراکنش با موفقیت حذف شد',
            };
        }

        return {
            success: false,
            message: responseData?.message || res.statusText,
        };
    } catch {
        return {
            success: false,
            message: 'خطای سرور',
        };
    }
}