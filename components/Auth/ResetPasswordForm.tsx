'use client'

import { resetPasswordDataSchema } from "@/database/validations/auth-validation";
import { zValidate } from "@/helpers/validation-helper";
import { Key, MoveRight, Pen } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

function ResetPasswordForm() {

    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const router = useRouter()

    useEffect(() => {

        if (!token) {
            router.replace('/auth?form=login')
        }

    }, [router, token])

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const initInputs = {
        password: '',
        confirmPassword: ''
    }

    const [inputs, setInputs] = useState(initInputs)

    const initErrors = {
        password: '',
        confirmPassword: ''
    }

    const [errors, setErrors] = useState(initErrors)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        if (loading) return

        setLoading(true)
        setErrorMsg('')
        setSuccessMsg('')

        try {

            // validate inputs

            const { hasError, errors } = zValidate(resetPasswordDataSchema, { token, ...inputs })

            if (hasError) {
                const errorMsg = 'اطلاعات وارد شده معتبر نمی باشد'
                console.log(errors)
                setErrorMsg(errorMsg)
                setErrors(errors)
                setLoading(false)
                return
            }
            setErrors(initErrors)

            const formData = new FormData;
            formData.append('token', token as string)
            formData.append('password', inputs.password)
            formData.append('confirmPassword', inputs.confirmPassword)

            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (data.status) {
                setSuccessMsg(data.message)
                setLoading(false)
                setInputs(initInputs)

                router.replace('/auth?form=login')
            } else {
                setErrorMsg(data.message)
                setLoading(false)
            }

        } catch (error) {

            console.log(error)
            setErrorMsg('An error occurred. Please try again later.')
            setLoading(false)
        }

    }


    return (

        <form onSubmit={handleSubmit} className="w-4/5 lg:w-3/5 aspect-video flex flex-col gap-y-2 justify-center items-center">

            <div className="rounded-full w-44 aspect-square bg-black/20 flex justify-center items-center">
                <Key className="size-24 text-indigo-200" />
            </div>

            <h1 className="text-xl font-bold text-indigo-100 mt-4">بازنشانی رمز عبور</h1>

            {errorMsg && (
                <p className="block text-center my-4 text-red-500 text-base font-semibold">{errorMsg}</p>
            )}

            {successMsg && (
                <p className="block text-center my-4 text-green-600 text-base font-semibold">{successMsg}</p>
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
                        value={inputs.confirmPassword}
                        onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        placeholder="تکرار رمز عبور"
                    />
                </div>
                {errors.confirmPassword && (
                    <span className="text-red-500 text-xs font-semibold text-center">{errors.confirmPassword}</span>
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