'use server'

import { cookies } from 'next/headers'

export async function login(credentials: { email: string; password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (data.token) {
        (await cookies()).set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        return { success: true };
    }

    return { success: false };
}