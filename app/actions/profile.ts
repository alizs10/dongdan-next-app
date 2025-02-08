'use server'

import { DeleteAccountRequest } from "@/types/requests/auth";
import { UpdateProfileRequest, UploadAvatarRequest } from "@/types/requests/profile";
import { Settings } from "@/types/settings";
import { cookies } from "next/headers";


export async function updateProfileReq(inputs: UpdateProfileRequest) {

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

export async function deleteAccountReq(inputs: DeleteAccountRequest) {

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

export async function uploadAvatarReq(inputs: UploadAvatarRequest) {

    const token = (await cookies()).get('token');

    const formData = new FormData;
    formData.append('avatar', inputs.avatar)
    // formData.append('_method', 'PUT')

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/upload-avatar`, {
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
            return {
                success: true,
                avatar: data.avatar,
                message: 'آواتار با موفقیت آپلود شد'
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

export async function deleteAvatarReq() {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/delete-avatar`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

        if (response.ok && data.status) {
            return {
                success: true,
                message: 'آواتار با موفقیت حدف شد'
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
