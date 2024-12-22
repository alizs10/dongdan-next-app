'use server'

import { ContactInputs } from "@/types/contact-types";
import { cookies } from "next/headers";


export async function createContactReq(inputs: ContactInputs) {

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

export async function updateContactReq(contactId: string, inputs: ContactInputs) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${contactId}`, {
            method: 'PUT',
            body: JSON.stringify(inputs),
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
                updatedContact: data.contact,
                message: 'دوست شما با موفقیت ویرایش شد'
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

export async function deleteContactReq(contactId: string) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${contactId}/delete`, {
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
                message: 'دوست شما با موفقیت حذف شد'
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

export async function restoreContactReq(contactId: string) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${contactId}/restore`, {
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
                message: 'دوست شما با موفقیت بازیابی شد'
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

export async function restoreContactItemsReq(contactIds: string[]) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/restore/items`, {
            method: 'PUT',
            body: JSON.stringify({ contacts: contactIds.map(id => id.toString()) }),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        let data = await response.json()
        console.log(data)

        if (response.ok && data.status) {
            return {
                success: true,
                message: 'دوستان شما با موفقیت بازیابی شدند'
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

export async function deleteContactItemsReq(contactIds: string[]) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/delete/items`, {
            method: 'DELETE',
            body: JSON.stringify({ contacts: contactIds.map(id => id.toString()) }),
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
                message: 'دوستان شما با موفقیت حذف شدند'
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