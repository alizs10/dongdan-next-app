'use client'

import { resetPasswordReq } from "@/app/actions/auth";
import { resetPasswordSchema } from "@/database/validations/auth-validation";
import { transformLaravelFieldErrors, zValidate } from "@/helpers/validation-helper";
import { ResetPasswordRequest } from "@/types/requests/auth";
import { Key, MoveRight, Pen } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

function ResetPasswordForm() {

    const [message, setMessage] = useState<FormStatusMessage | null>(null)
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams()

    const token = searchParams.get('token')
    const email = searchParams.get('email')

    const router = useRouter()

    useEffect(() => {

        if (!token || !email) {
            router.replace('/auth?form=login')
        }

    }, [router, token])


    const initInputs = {
        password: '',
        password_confirmation: ''
    }

    const [inputs, setInputs] = useState(initInputs)

    const initErrors = {
        password: '',
        password_confirmation: ''
    }

    const [errors, setErrors] = useState<Record<string, string>>(initErrors)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        if (loading) return
        setLoading(true)
        setMessage({
            type: 'info',
            body: 'در حال ارسال درخواست...'
        })


        const resetPasswordInputs: ResetPasswordRequest = {
            email: email ?? '',
            token: token ?? '',
            password: inputs.password,
            password_confirmation: inputs.password_confirmation
        }

        const { hasError, errors } = zValidate(resetPasswordSchema, resetPasswordInputs)

        if (hasError) {
            setLoading(false)
            setErrors(errors)
            setMessage({
                type: 'error',
                body: 'اطلاعات وارد شده صحیح نمی باشد'
            })
            return
        }
        setErrors(initErrors)

        const res = await resetPasswordReq(resetPasswordInputs)

        if (!res.success) {
            setLoading(false)
            setMessage({
                type: 'error',
                body: res.message
            })
            if (res?.statusCode === 422) {
                setErrors(transformLaravelFieldErrors(res.errors))
            }
            return
        }

        setLoading(false)
        setInputs(initInputs)
        setMessage({
            type: 'success',
            body: res.message
        })
    }

    return (

        <form onSubmit={handleSubmit} className="w-4/5 lg:w-3/5 aspect-video flex flex-col gap-y-2 justify-center items-center">

            <div className="rounded-full w-44 aspect-square bg-black/20 flex justify-center items-center">
                <Key className="size-24 text-indigo-200" />
            </div>

            <h1 className="text-xl font-bold text-indigo-100 mt-4">بازنشانی رمز عبور</h1>

            {message && (
                <p className={`block text-center my-4 ${message.type === 'error' ? 'text-red-500' : message.type === 'success' ? 'text-green-600' : 'text-gray-300'} text-base font-semibold`}>{message.body}</p>
            )}

            <div className="mt-6 flex flex-col gap-y-2">


                <div className="flex flex-wrap rounded-full bg-black/40 overflow-hidden">
                    <div className="px-6 flex justify-center items-center">
                        <Key className="size-6 text-indigo-200" />
                    </div>
                    <input
                        className="bg-transparent font-sans placeholder:text-gray-400 placeholder:font-[estedadFD] placeholder:font-normal text-indigo-200 px-5 py-3 text-lg focus:outline-none"
                        type="password"
                        name="password"
                        dir="ltr"
                        value={inputs.password}
                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        placeholder="رمز عبور جدید"
                    />
                </div>
                {errors.password && (
                    <span className="text-red-500 text-xs font-semibold text-center">{errors.password}</span>
                )}

                <div className="flex flex-wrap rounded-full bg-black/40 overflow-hidden">
                    <div className="px-6 flex justify-center items-center">
                        <Key className="size-6 text-indigo-200" />
                    </div>
                    <input
                        className="bg-transparent font-sans placeholder:text-gray-400 placeholder:font-[estedadFD] placeholder:font-normal text-indigo-200 px-5 py-3 text-lg focus:outline-none"
                        type="password"
                        name="password"
                        dir="ltr"
                        value={inputs.password_confirmation}
                        onChange={(e) => setInputs({ ...inputs, password_confirmation: e.target.value })}
                        placeholder="تکرار رمز عبور"
                    />
                </div>
                {errors.password_confirmation && (
                    <span className="text-red-500 text-xs font-semibold text-center">{errors.password_confirmation}</span>
                )}

                <button type="submit" className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4">
                    <span className="text-indigo-200">تغییر رمز عبور</span>
                    <Pen className="size-6" />
                </button>


            </div>

            <Link href={'/auth?form=login'}>
                <div className="mt-10 flex flex-row gap-x-3 items-center text-indigo-300 text-base transition-all duration-300 hover:text-indigo-400">
                    <MoveRight className="size-5" />
                    <span>بازگشت</span>
                </div>
            </Link>
        </form>
    );
}

export default ResetPasswordForm;