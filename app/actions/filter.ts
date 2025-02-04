'use server'

import { cookies } from 'next/headers'

export async function filterExpensesReq(eventId: string | number, filtersQuery: string, cursor?: string, cursorId?: number, excludeIds?: number[]) {

    const token = (await cookies()).get('token');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/expenses/filter?${filtersQuery}${cursor ? `&cursor=${cursor}` : ''}${cursorId ? `&cursor_id=${cursorId}` : ''}${excludeIds ? `&exclude_ids=${excludeIds.join(',')}` : ''}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok && data.status) {
            return {
                success: true,
                expenses: data.data.expenses,
                paginationData: data.data.pagination,
                message: 'هزینه‌های با موفقیت فیلتر شدند'
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

