'use server'

import { InitDataResponse } from "@/types/responses/personal/init";
import { cookies } from "next/headers";

export const fetchInitData = async () => {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personal/init`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data: InitDataResponse = await response.json()

        console.log(data)

        if (response.ok && data.status) {

            return {
                success: data.status,
                data: data.data,
                message: data.message ?? 'اطلاعات با موفقیت بارگذاری شد'
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
};