'use server'

import { SchemeType } from "@/types/event-types";
import { cookies } from "next/headers";

type UpdateProfileInputs = {
    name: string;
    email: string;
    scheme: SchemeType;
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