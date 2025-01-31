'use server'

import { CreateExpendRequest, CreateMemberRequest, CreateTransferRequest } from "@/types/requests/event";
import { CreateExpenseResponse, DeleteExpenseResponse, LoadMoreExpensesResponse } from "@/types/responses/event";
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
        console.log(inputs)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/members`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

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

        const data = await response.json()

        if (response.ok && data.status) {

            return {
                success: true,
                message: 'عضو با موفقیت خذف شد'
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

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/member/${memberId}`, {
            method: 'PUT',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
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

            return {
                success: true,
                expense: data.expense,
                event_data: data.event_data,
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

        const data = await response.json()

        if (response.ok && data.status) {

            return {
                success: true,
                expense: data.expense,
                event_data: data.event_data,
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

        const data = await response.json()

        if (response.ok && data.status) {
            return {
                success: true,
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

export async function loadMoreExpensesReq(eventId: string | number, page: number, perPage: number) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/expenses?page=${page}&per_page=${perPage}`, {
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

