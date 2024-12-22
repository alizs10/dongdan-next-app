'use server'

import { cookies } from "next/headers";

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
