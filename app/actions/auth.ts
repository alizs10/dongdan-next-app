'use server'

import { cookies } from 'next/headers'

export type LoginCredentials = {
    email: string;
    password: string;
}

export type RegisterCredentials = {
    email: string;
    password: string;
    password_confirmation: string;
}

export type ChangePasswordInputs = {
    password: string;
    new_password: string;
    new_password_confirmation: string;
}

export type ForgotPasswordInputs = {
    email: string;
}

export async function loginReq(credentials: LoginCredentials) {

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


    return { success: false, message: data.message, statusCode: response.status };
}

export async function registerReq(credentials: RegisterCredentials) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    const data = await response.json();

    if (!response.ok && response.status === 422) {
        return { success: false, message: 'اطلاعات وارد شده صحیح نمی باشد.', statusCode: response.status, errors: data.errors };
    }

    if (response.ok && data.status) {
        return { success: true, message: 'کاربر با موفقیت ثبت نام شد.' };
    }



    return { success: false, message: data.message };
}

export async function sendEmailVerificationReq() {

    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.value}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    const data = await response.json();

    console.log(data)

    if (!response.ok && response.status === 400) {
        return { success: false, message: 'ایمیل شما قبلا تایید شده است' };
    }

    if (response.ok && data.status) {
        return { success: true, message: 'ایمیل تایید حساب برای شما ارسال شد.' };
    }

    return { success: false, message: data.message };
}

export async function changePasswordReq(changePasswordInputs: ChangePasswordInputs) {

    const token = (await cookies()).get('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: 'POST',
        body: JSON.stringify(changePasswordInputs),
        headers: {
            Authorization: `Bearer ${token?.value}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    const data = await response.json();

    if (!response.ok && response.status === 422) {
        return { success: false, message: 'اطلاعات وارد شده صحیح نمی باشد.', statusCode: response.status, errors: data.errors };
    }

    if (response.ok && data.status) {
        return { success: true, message: data.message };
    }

    return { success: false, message: data.message || response.statusText };
}

export async function forgotPasswordReq(forgotPasswordInputs: ForgotPasswordInputs) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        body: JSON.stringify(forgotPasswordInputs),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    const data = await response.json();

    if (!response.ok && response.status === 422) {
        return { success: false, message: 'اطلاعات وارد شده صحیح نمی باشد.', statusCode: response.status, errors: data.errors };
    }

    if (response.ok && data.status) {
        return { success: true, message: data.message };
    }

    return { success: false, message: data.message || response.statusText };
}

export async function logoutReq() {

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

export async function getLoggedInUserReq() {

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