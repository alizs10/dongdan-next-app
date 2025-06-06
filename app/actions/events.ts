'use server'

import { CreateEventRequest, UpdateEventRequest } from "@/types/requests/events";
import { cookies } from "next/headers";


export async function getEventMembersReq(eventId: string) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/members`, {
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
                members: data.members,
                message: 'اعضا با موفقیت دریافت شدند'
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

export async function getEventNonMembersReq(eventId: string) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/non-members`, {
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
                nonMembers: data.non_members,
                selfIncluded: data.self_included,
                message: 'اعضا با موفقیت دریافت شدند'
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

export async function updateEventReq(eventId: string, inputs: UpdateEventRequest) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}`, {
            method: 'PUT',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

        if (response.ok) {
            return {
                success: true,
                updatedEvent: data.event,
                message: 'رویداد شما با موفقیت بروزرسانی شد'
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

export async function updateEventStatusReq(eventId: string, end_date?: Date) {

    const token = (await cookies()).get('token');

    let input_data: { end_date?: Date } = {}
    if (end_date)
        input_data['end_date'] = end_date

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/status`, {
            method: 'PUT',
            body: JSON.stringify(input_data),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json()
        console.log(data)

        if (response.ok) {
            return {
                success: true,
                end_date: data.end_date,
                message: 'رویداد شما با موفقیت بروزرسانی شد'
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

export async function createEventReq(inputs: CreateEventRequest) {

    const token = (await cookies()).get('token');

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
            method: 'POST',
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
                newEvent: data.event,
                message: 'رویداد جدید با موفقیت ساخته شد'
            }
        }

        return {
            success: false,
            message: data?.messsage ? data.message : response.statusText
        }

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function deleteEventReq(eventId: string) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/delete`, {
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
                message: 'رویداد شما با موفقیت حذف شد'
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

export async function restoreEventReq(eventId: string) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/restore`, {
            method: 'PUT',
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
                message: 'رویداد شما با موفقیت بازیابی شد'
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

export async function trashEventReq(eventId: string) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}`, {
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
                message: 'رویداد شما با موفقیت حذف شد'
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

export async function trashEventItemsReq(eventIds: string[]) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/trash/items`, {
            method: 'DELETE',
            body: JSON.stringify({ events: eventIds.map(id => id.toString()) }),
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
                message: 'رویدادان شما با موفقیت حذف شدند'
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

export async function restoreEventItemsReq(eventIds: string[]) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/restore/items`, {
            method: 'PUT',
            body: JSON.stringify({ events: eventIds.map(id => id.toString()) }),
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
                message: 'رویدادهای شما با موفقیت بازیابی شدند'
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

export async function deleteEventItemsReq(eventIds: string[]) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/delete/items`, {
            method: 'DELETE',
            body: JSON.stringify({ events: eventIds.map(id => id.toString()) }),
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
                message: 'رویدادهای شما با موفقیت حذف شدند'
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
