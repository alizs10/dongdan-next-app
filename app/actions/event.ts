'use server'

import { SchemeType } from "@/types/event-types";
import { cookies } from "next/headers";

type AddContactsInputs = {
    contacts: string[];
    self_included: 'true' | 'false';
}

type CreateMemberInputs = {
    name: string;
    scheme: SchemeType;
    email?: string;
}
export type CreateMemberReqInputs = AddContactsInputs | CreateMemberInputs;

export type CreateExpendReqInputs = {
    description: string;
    amount: string;
    type: "expend";
    date: Date;
    payer_id: string;
    contributors: string[];
}
export type CreateTransferReqInputs = {
    description: string;
    amount: string;
    type: "transfer";
    date: Date;
    transmitter_id: string;
    receiver_id: string;
}

type CreateExpenseReqInputs = CreateExpendReqInputs | CreateTransferReqInputs;

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

export async function createMemberReq(eventId: string, inputs: CreateMemberReqInputs) {

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

export async function updateMemberReq(eventId: string | number, memberId: string | number, inputs: CreateMemberInputs) {

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

export async function createExpenseReq(eventId: string | number, inputs: CreateExpenseReqInputs) {

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

        const data = await response.json()

        if (response.ok && data.status) {

            return {
                success: true,
                expense: data.expense,
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

export async function updateExpenseReq(eventId: string | number, expenseId: string | number, inputs: CreateExpenseReqInputs) {

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

        const data = await response.json()

        if (response.ok && data.status) {

            return {
                success: true,
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