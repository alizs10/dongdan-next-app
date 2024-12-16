import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export type NextCustomApiHandler<T = any> = (req: NextRequest, res: NextResponse<T>) => unknown | Promise<unknown>

export default function RequireAuth(handler: NextCustomApiHandler) {
    return async (req: NextRequest, res: NextResponse) => {
        const session = await auth();

        if (!session) {
            return new Response('Unauthorized', {
                status: 401
            })
        }

        return handler(req, res);
    };
};