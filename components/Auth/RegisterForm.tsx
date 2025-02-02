'use client'

import { registerReq } from "@/app/actions/auth";
import { registerCredentialsSchema } from "@/database/validations/auth-validation";
import { transformLaravelFieldErrors, zValidate } from "@/helpers/validation-helper";
import { FormStatusMessage } from "@/types/globals";
import { RegisterCredentialsRequest } from "@/types/requests/auth";
import { ArrowLeft, Key, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function RegisterForm() {

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<FormStatusMessage | null>(null)

    const initInputs = {
        email: '',
        password: '',
        password_confirmation: '',
    }

    const [inputs, setInputs] = useState<RegisterCredentialsRequest>(initInputs)

    const initErrors = {
        email: '',
        password: '',
        password_confirmation: ''
    }
    const [errors, setErrors] = useState(initErrors)

    const router = useRouter();

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (loading) return
        setLoading(true)
        setMessage({
            type: 'info',
            body: 'در حال ورود...'
        })

        const { hasError, errors } = zValidate(registerCredentialsSchema, inputs)

        if (hasError) {
            setLoading(false)
            setErrors({ ...initErrors, ...errors })
            setMessage({
                type: 'error',
                body: 'اطلاعات وارد شده صحیح نمی باشد'
            })
            return
        }
        setErrors(initErrors)


        const res = await registerReq(inputs)

        if (!res.success) {
            setLoading(false)
            setMessage({
                type: 'error',
                body: res.message
            })

            if (res?.statusCode === 422) {
                setErrors({ ...initErrors, ...transformLaravelFieldErrors(res.errors) })
            }

            return
        }

        setMessage({
            type: 'success',
            body: 'ثبت نام با موفقیت انجام شد. در حال ورود به حساب کاربری...'
        })
        router.push('/auth?form==login')

    }

    return (
        <form onSubmit={onSubmit}>
            {message && (
                <p className={`block text-center my-4 ${message.type === 'error' ? 'text-red-500' : message.type === 'success' ? 'text-green-600' : 'text-gray-300'} text-base font-semibold`}>{message.body}</p>
            )}

            <div className="mt-6 flex flex-col gap-y-2">


                <div className="flex flex-wrap rounded-full bg-black/40 overflow-hidden">
                    <div className="px-6 flex justify-center items-center">
                        <Mail className="size-6 text-indigo-200" />
                    </div>
                    <input
                        className="bg-transparent font-sans placeholder:text-gray-400 placeholder:font-[estedadFD] placeholder:font-normal text-indigo-200 px-5 py-3 text-lg focus:outline-none"
                        type="text"
                        name="email"
                        dir="ltr"
                        value={inputs.email}
                        onChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="ایمیل شما"
                    />

                </div>
                {errors.email && (
                    <span className="text-red-500 text-xs font-semibold text-center">{errors.email}</span>
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
                        value={inputs.password}
                        onChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="رمز عبور"
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
                        name="password_confirmation"
                        dir="ltr"
                        value={inputs.password_confirmation}
                        onChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="تکرار رمز عبور"
                    />

                </div>
                {errors.password_confirmation && (
                    <span className="text-red-500 text-xs font-semibold text-center">{errors.password_confirmation}</span>
                )}

                <button className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4" type="submit">
                    <span className="text-indigo-200">ثبت نام</span>
                    <ArrowLeft className="size-6" />
                </button>


            </div>
        </form>
    );
}

export default RegisterForm;