"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setTokens } from "@/app/actions/apiFetch";

export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
    'use server'

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-api.com";
    const cookieStore = await cookies();
    let accessToken = cookieStore.get("token")?.value;
    let refreshToken = cookieStore.get("refresh_token")?.value;

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

        console.log("here")

        if (response.status === 401) {
            console.log("here 1")
            // Refresh token if unauthorized
            try {
                const newToken = await refreshTokenIfNeeded();

                console.log("new token", newToken)

                if (newToken) {
                    return fetchData(newToken); // Retry original request with new token
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
                redirect('/auth?form=Login');
            }

            return;
        }

        console.log(response)

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
    };

    return fetchData(accessToken);
}

// Refresh Token Function
async function refreshTokenIfNeeded() {
    'use server'
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-api.com";
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refresh_token")?.value;

        if (!refreshToken) {
            redirect('/auth?form=Login');
        }
        console.log("here 2")

        const response = await fetch(`${baseUrl}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
            credentials: "include",
        });

        console.log("Refresh token response status:", response.status);

        if (!response.ok) {
            console.log("here 3")
            console.log(response)
            if (response.status === 401) {
                console.log("here 4")
                // If refresh token is also unauthorized, redirect to login page
                redirect('/auth?form=Login');
            }
            throw new Error(`Refresh token failed with status: ${response.status}`);
        }

        console.log("here 5")

        const data = await response.json();
        // console.log("my new refresh token and token", data)

        // Update cookies with new tokens
        (await cookies()).set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 1 * 24 * 60 * 60, // 1 days
        });
        (await cookies()).set('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return data.token; // Return new access token
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error; // Re-throw to be handled by the caller
    }
}
