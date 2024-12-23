'use server'

import { cookies } from 'next/headers'

export async function login(credentials: { email: string; password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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
        return { success: true, user: data.user };
    }

    return { success: false };
}

export async function logout() {

    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.value}`,
            'Accept': 'application/json',
        },
    });

    if (response.ok) {
        return { success: true };
    }

    return { success: false };
}

export async function getLoggedInUser() {

    const token = (await cookies()).get('token');

    if (!token) return { success: false, message: 'User not logged in' };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                Accept: 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok && data.status) {
            return { success: true, user: data.profile };
        }

        return { success: false, message: data?.message ?? 'Server error' };

    } catch (error) {
        return { success: false, message: "Server error" };

    }
}