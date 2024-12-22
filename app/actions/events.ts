'use server'

import { cookies } from "next/headers";

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

        let data = await response.json()

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

    } catch (error) {

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

        let data = await response.json()

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

    } catch (error) {

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

        let data = await response.json()

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

    } catch (error) {

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

        let data = await response.json()

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

    } catch (error) {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }

}