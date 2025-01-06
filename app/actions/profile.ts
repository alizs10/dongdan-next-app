'use server'

import { SchemeType } from "@/types/event-types";
import { Settings } from "@/types/user-types";
import { cookies } from "next/headers";

type UpdateProfileInputs = {
    name: string;
    email: string;
    scheme: SchemeType;
}

type DeleteAccountInputs = {
    password: string;
}

export async function updateProfileReq(inputs: UpdateProfileInputs) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
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
                profile: data.profile,
                message: 'پروفایل شما با موفقیت بروزرسانی شد'
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

export async function updateSettingsReq(inputs: Settings) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/settings`, {
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
                settings: data.settings,
                message: 'تنظیمات با موفقیت بروزرسانی شد'
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

export async function deleteAccountReq(inputs: DeleteAccountInputs) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/delete-account`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

        if (!response.ok && response.status === 422) {
            return { success: false, message: 'اطلاعات وارد شده صحیح نمی باشد.', statusCode: response.status, errors: data.errors };
        }

        if (response.ok && data.status) {
            return { success: true, message: data.message };
        }

        return { success: false, message: data.message || response.statusText };

    } catch {

        return {
            success: false,
            message: 'خطای سرور'
        }

    }


}