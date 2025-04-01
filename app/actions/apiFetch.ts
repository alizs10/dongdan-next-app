"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-api.com";
    const cookieStore = cookies(); // Removed await
    let accessToken = (await cookieStore).get("token")?.value;
    let refreshToken = (await cookieStore).get("refresh_token")?.value;

    const fetchData = async (token: string | undefined) => {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
        });

        if (response.status === 401) {
            try {
                const newToken = await refreshTokenIfNeeded();
                if (newToken) {
                    return fetchData(newToken);
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
                redirect('/auth?form=Login');
            }
            return;
        }

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
    };

    return fetchData(accessToken);
}

async function refreshTokenIfNeeded() {
    'use server'
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-api.com";
        const cookieStore = cookies(); // Removed await
        const refreshToken = (await cookieStore).get("refresh_token")?.value;

        if (!refreshToken) {
            redirect('/auth?form=Login');
        }

        const response = await fetch(`${baseUrl}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
            credentials: "include",
        });

        if (!response.ok) {
            if (response.status === 401) {
                redirect('/auth?form=Login');
            }
            throw new Error(`Refresh token failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Correctly set cookies using the existing cookieStore instance
        (await cookieStore).set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 1 * 24 * 60 * 60,
        });
        (await cookieStore).set('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
        });

        return data.token;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}