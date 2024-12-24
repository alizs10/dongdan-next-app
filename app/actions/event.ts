'use server'

import { SchemeType } from "@/types/event-types";
import { cookies } from "next/headers";

type AddContactsInputs = {
    contacts: string[];
    self_included: 'true' | 'false';
}

type CreateMemberInputs = {
    name: string;
    scheme: SchemeType;
    email?: string;
}
export type CreateMemberReqInputs = AddContactsInputs | CreateMemberInputs;


export async function createMemberReq(eventId: string, inputs: CreateMemberReqInputs) {

    const token = (await cookies()).get('token');

    try {
        console.log(inputs)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/members`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json()

        if (response.ok && data.status) {

            if ('contacts' in inputs) {
                return {
                    success: true,
                    members: data.members,
                    message: 'اعضا با موفقیت اضافه شدند'
                }
            }

            return {
                success: true,
                member: data.member,
                message: 'عضو جدید با موفقیت اضافه شد'
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

export async function deleteMemberReq(eventId: string, memberId: string | number) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/member/${memberId}`, {
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
                message: 'عضو با موفقیت خذف شد'
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