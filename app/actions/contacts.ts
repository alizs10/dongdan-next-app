'use server'

import { NewContactInputs } from "@/types/contact-types";
import { cookies } from "next/headers";


export async function createContactReq(inputs: NewContactInputs) {

    const token = (await cookies()).get('token');

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        let data = await response.json()

        if (response.ok) {

            console.log(data.contact)
            return {
                success: true,
                newContact: data.contact,
                message: 'دوست جدید با موفقیت ساخته شد'
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

export async function trashContactReq(contactId: string) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${contactId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        let data = await response.json()

        if (response.ok) {
            return {
                success: true,
                message: 'دوست با موفقیت حذف شد'
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