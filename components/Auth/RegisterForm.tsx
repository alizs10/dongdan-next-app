'use client'

import { registerDataSchema } from "@/database/validations/auth-validation";
import { zValidate } from "@/helpers/validation-helper";
import { ArrowLeft, Key, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function RegisterForm() {

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const initInputs = {
        email: '',
        password: '',
        confirmPassword: '',
    }

    const [inputs, setInputs] = useState(initInputs)

    const initErrors = {
        email: '',
        password: '',
        confirmPassword: ''
    }
    const [errors, setErrors] = useState(initErrors)

    const router = useRouter();

    async function onSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault()

        if (loading) return
        setLoading(true)
        setErrorMsg('')

        try {

            // validate form inputs
            const { hasError, errors } = zValidate(registerDataSchema, inputs)
            console.log("we are here", inputs)
            if (hasError) {
                const errMsg = "اطلاعات وارد شده صحیح نمی باشد"
                // or just show a error toast
                setErrorMsg(errMsg)
                setErrors({ ...initErrors, ...errors })
                setLoading(false)
                return
            }
            setErrors(initErrors)

            const formData = new FormData;
            for (const key in inputs) {
                formData.append(key, inputs[key as keyof typeof inputs])
            }

            const result = await fetch('/api/auth/register',
                {
                    method: 'POST',
                    body: formData
                })

            if (!result.ok) {

                if (result.status === 409) {
                    const errMsg = 'این ایمیل قبلا استفاده شده است'
                    setErrorMsg(errMsg)
                } else {
                    setErrorMsg(result.statusText)
                }

                setLoading(false)
                return
            }

            // first show a success toast

            // then redirect user
            router.push('/auth?form=login')
        } catch {
            const errMsg = "خطای سرور"
            // or just show a error toast
            setErrorMsg(errMsg)
            setLoading(false)
        }

    }

    return (
        <form onSubmit={onSubmit}>
            {errorMsg && (
                <p className="block text-center my-4 text-red-500 text-base font-semibold">{errorMsg}</p>
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
                        name="confirmPassword"
                        dir="ltr"
                        value={inputs.confirmPassword}
                        onChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="تکرار رمز عبور"
                    />

                </div>
                {errors.confirmPassword && (
                    <span className="text-red-500 text-xs font-semibold text-center">{errors.confirmPassword}</span>
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