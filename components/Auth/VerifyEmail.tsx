'use client'

import { UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function VerifyEmail({ result }: { result: { success: boolean, message: string } }) {

    const router = useRouter()

    useEffect(() => {

        if (result.success) {
            setTimeout(() => {
                router.replace('/dashboard/profile')
            }, 3000)
        }

    }, [result.success])

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="mx-auto rounded-full w-44 aspect-square bg-black/20 flex justify-center items-center">
                {result.success ? (
                    <UserCheck className="size-24 text-indigo-200" />
                ) : (
                    <UserX className="size-24 text-indigo-200" />
                )}
            </div>

            <h1 className={`mt-10 text-xl font-semibold ${result.success ? 'text-gray-300' : 'text-red-500'}`}>{result.success ? `${result.message}، در حال انتقال...` : result.message}</h1>
        </div>
    );
}

export default VerifyEmail;