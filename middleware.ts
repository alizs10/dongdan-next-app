import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {

    const token = request.cookies.get('token')?.value;
    console.log("we are here")

    if (!token) {
        console.log("no token found!")
        return NextResponse.redirect(new URL('/auth?form=login', request.url));
    }

    try {
        // Validate token with your Laravel backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate-token`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        });

        if (!response.ok) {
            // Clear invalid token
            const response = NextResponse.redirect(new URL('/auth?form=login', request.url));
            response.cookies.delete('token');
            return response;
        }

        return NextResponse.next();
    } catch (error) {
        // Handle network errors
        console.log(error)
        return NextResponse.redirect(new URL('/auth?form=login', request.url));
    }
}

export const config = {
    matcher: [
        // '/dashboard/:path*'
        // Add other protected routes
    ]
};
