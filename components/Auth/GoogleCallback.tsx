'use client'

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleIcon from "./Layout/GoogleIcon";
import { loginWithGoogle } from "@/app/actions/auth";

function GoogleCallback() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const code = searchParams.get('code');
    const scope = searchParams.get('scope');
    const authuser = searchParams.get('authuser');
    const prompt = searchParams.get('prompt');

    const params = `?code=${code}&scope=${scope}&authuser=${authuser}&prompt=${prompt}`

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<{ success: boolean, message: string } | null>(null);

    useEffect(() => {

        async function handleGoogleLogin() {
            const res = await loginWithGoogle(params)
            setResult({ success: res.success, message: res.message })
            setLoading(false);

            if (res.success) {
                setTimeout(() => {
                    router.replace('/dashboard/events')
                }, 3000)
            } else {
                setTimeout(() => {
                    router.replace('/auth?form=login')
                }, 3000)
            }

        }

        handleGoogleLogin()

    }, [params])

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="mx-auto rounded-full w-44 aspect-square bg-black/20 flex justify-center items-center">

                {(loading || result?.success) && (
                    <div className="rounded-full w-44 aspect-square bg-black/20 flex justify-center items-center">
                        <div className="size-24">
                            <GoogleIcon />
                        </div>
                    </div>
                )}


                {(!loading && !result?.success) && (
                    <X className="size-24 text-indigo-200" />
                )}
            </div>

            <h1 className={`mt-10 text-xl font-semibold ${(loading || result?.success) ? 'text-gray-300' : 'text-red-500'}`}>{loading ? 'در حال ورود، صبر کنید' : result?.success ? `${result?.message}، در حال انتقال...` : result?.message ?? 'خطا در ورود'}</h1>
        </div>
    );
}

export default GoogleCallback;