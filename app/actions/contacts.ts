'use server'

import { CreateContactRequest } from "@/types/requests/contacts";
import { cookies } from "next/headers";

export async function getContactsReq() {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
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
                contacts: data.contacts,
                message: 'دوست ها با موفقیت بازیابی شدند'
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

export async function getContactReq(contactId: string | number) {
    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${contactId}`, {
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
                contact: data.contact,
                message: data.message
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

export async function createContactReq(inputs: CreateContactRequest) {

    const token = (await cookies()).get('token');

    try {
        const formData: FormData = new FormData();
        Object.entries(inputs).forEach(([key, value]) => {
            if (value === null) return;
            if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, value.toString());
            }
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

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

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}

export async function trashContactReq(contactId: string | number) {

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

        const data = await response.json()

        if (response.ok && data.status) {
            return {
                success: true,
                message: 'دوست شما با موفقیت حذف شد'
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

export async function updateContactReq(contactId: string | number, inputs: CreateContactRequest) {

    const token = (await cookies()).get('token');

    try {

        const formData: FormData = new FormData();
        formData.append("_method", 'PUT')
        Object.entries(inputs).forEach(([key, value]) => {
            if (value === null) return;
            if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, value.toString());
            }
        });


        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${contactId}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

        if (response.ok) {
            return {
                success: true,
                updatedContact: data.contact,
                message: 'دوست شما با موفقیت بروزرسانی شد'
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

export async function deleteContactReq(contactId: string | number) {

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

        const data = await response.json()

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

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }

}

export async function restoreContactReq(contactId: string | number) {

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

        const data = await response.json()

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

    } catch {

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

        const data = await response.json()
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

    } catch {

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

        const data = await response.json()

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

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }

}

export async function trashContactItemsReq(contactIds: string[]) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/trash/items`, {
            method: 'DELETE',
            body: JSON.stringify({ contacts: contactIds.map(id => id.toString()) }),
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
                message: 'دوستان شما با موفقیت حذف شدند'
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