'use server'

import { CreateExpendRequest, CreateMemberRequest, CreateTransferRequest } from "@/types/requests/event";
import { CreateExpenseResponse, DeleteExpenseResponse, DeleteMemberResponse, LoadMoreExpensesResponse, UpdateExpenseResponse } from "@/types/responses/event";
import { cookies } from "next/headers";

export async function getEventExpensesReq(eventId: string | number) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/expenses`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

        if (response.ok && data.status) {

            return {
                success: true,
                expenses: data.expenses,
                message: 'هزینه ها با موفقیت بارگذاری شد'
            }
        }

        return {
            success: false,
            message: response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function createMemberReq(eventId: string, inputs: CreateMemberRequest) {

    const token = (await cookies()).get('token');

    try {

        const formData = new FormData;
        Object.entries(inputs).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    formData.append(`${key}[${index}]`, item);
                });
            } else {
                formData.append(key, value);
            }
        });



        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/members`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

        console.log(data)

        if (response.ok && data.status) {

            if ('contacts' in inputs) {
                return {
                    success: true,
                    members: data.members,
                    message: 'اعضا با موفقیت اضافه شدند'
                }
            }

            return {
                success: true,
                member: data.member,
                message: 'عضو جدید با موفقیت اضافه شد'
            }
        }

        return {
            success: false,
            message: response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function deleteMemberReq(eventId: string, memberId: string | number) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/member/${memberId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: DeleteMemberResponse = await response.json()

        if (response.ok && data.status) {

            return {
                success: true,
                message: 'عضو با موفقیت خذف شد',
                expenses: data.expenses,
                event_members: data.event_members,
                event_data: data.event_data
            }
        }

        return {
            success: false,
            message: response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function updateMemberReq(eventId: string | number, memberId: string | number, inputs: CreateMemberRequest) {

    const token = (await cookies()).get('token');

    const formData = new FormData;
    formData.append("_method", 'PUT')
    Object.entries(inputs).forEach(([key, value]) => {
        console.log(key, value)
        formData.append(key, value);
    });

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/member/${memberId}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Accept': 'application/json',
                // 'Content-Type': 'multipart/form-data', // اصلاح نوع محتوا
            },
        });

        const data = await response.json()

        console.log(data)

        if (response.ok && data.status) {

            return {
                success: true,
                member: data.member,
                message: 'عضو با موفقیت بروزرسانی شد'
            }
        }

        return {
            success: false,
            message: response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function createExpenseReq(eventId: string | number, inputs: CreateExpendRequest | CreateTransferRequest) {

    const token = (await cookies()).get('token');

    try {
        console.log(inputs)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/expenses`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: CreateExpenseResponse = await response.json()

        if (response.ok && data.status) {

            console.log(data)

            return {
                success: true,
                expense: data.expense,
                event_data: data.event_data,
                event_members: data.event_members,
                message: 'هزینه جدید با موفقیت اضافه شد'
            }
        }

        return {
            success: false,
            message: response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function updateExpenseReq(eventId: string | number, expenseId: string | number, inputs: CreateExpendRequest | CreateTransferRequest) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/expense/${expenseId}`, {
            method: 'PUT',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: UpdateExpenseResponse = await response.json()

        if (response.ok && data.status) {

            return {
                success: true,
                expense: data.expense,
                event_data: data.event_data,
                event_members: data.event_members,
                message: 'هزینه با موفقیت بروزرسانی شد'
            }
        }

        return {
            success: false,
            message: response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function deleteExpenseReq(eventId: string, expenseId: string | number) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/expense/${expenseId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: DeleteExpenseResponse = await response.json()

        if (response.ok && data.status) {

            return {
                success: true,
                event_data: data.event_data,
                event_members: data.event_members,
                message: 'هزینه با موفقیت خذف شد'
            }
        }

        return {
            success: false,
            message: response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function deleteExpenseItemsReq(eventId: string | number, expenseIds: string[]) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/expenses/delete/items`, {
            method: 'DELETE',
            body: JSON.stringify({ expenses: expenseIds.map(id => id.toString()) }),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: DeleteExpenseResponse = await response.json()

        if (response.ok && data.status) {
            return {
                success: true,
                event_data: data.event_data,
                event_members: data.event_members,
                message: 'هزینه ها با موفقیت حذف شدند'
            }
        }

        return {
            success: false,
            message: data?.message ? data.message : response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }

}

export async function loadMoreExpensesReq(eventId: string | number, cursor: string, nextCursorId: number, excludeIds: number[]) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/expenses?cursor=${cursor}&limit=10&cursor_id=${nextCursorId}&exclude_ids=${excludeIds.join(',')}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: LoadMoreExpensesResponse = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                expenses: data.data.expenses,
                paginationData: data.data.pagination,
                message: 'هزینه‌های بیشتر با موفقیت دریافت شدند'
            }
        }

        return {
            success: false,
            message: data?.message ? data.message : response.statusText
        }

    } catch {
        return {
            success: false,
            message: 'خطای سرور'
        }
    }
}

