'use client'

import { ArrowLeft, Github, Key, Mail } from "lucide-react";
import GoogleIcon from "./Layout/GoogleIcon";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zValidate } from "@/helpers/validation-helper";
import { loginDataSchema } from "@/database/validations/auth-validation";
// import googleIcon from '../google-icon.svg';

function LoginForm() {

    const initInputs = {
        email: '',
        password: ''
    }
    const [inputs, setInputs] = useState(initInputs)

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const initErrors = {
        email: '',
        password: ''
    }
    const [errors, setErrors] = useState(initErrors)

    const router = useRouter()

    async function handleCredentialsLogin() {

        if (loading) return
        setLoading(true)
        setErrorMsg('')
        setSuccessMsg('')

        try {

            //validate inputs
            let { hasError, errors } = zValidate(loginDataSchema, inputs)

            if (hasError) {
                setErrorMsg('اطلاعات وارد شده صحیح نمی باشد')
                setErrors(errors)
                setLoading(false)
                return
            }
            setErrors(initErrors)

            let res = await signIn('credentials', { redirect: false, email: inputs.email, password: inputs.password })

            if (res?.ok) {
                // show success toast
                setSuccessMsg('ورود با موفقیت انجام شد')
                router.replace('/dashboard/events')
                return
            }

            if (res?.status === 401) {
                setErrorMsg('ایمیل یا رمز عبور اشتباه است')
                setLoading(false)
                return
            }

            setErrorMsg(res?.error || 'خطایی رخ داده است')
            setLoading(false)
        } catch (error) {
            console.log(error)
            setErrorMsg('خطایی رخ داده است')
            setLoading(false)
        }

    }

    return (
        <div className="mt-6 flex flex-col gap-y-2">

            {errorMsg && (
                <p className="block text-center my-4 text-red-500 text-base font-semibold">{errorMsg}</p>
            )}

            {successMsg && (
                <p className="block text-center my-4 text-green-600 text-base font-semibold">{successMsg}</p>
            )}

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

            <Link href={'/auth/forgot-password'}>
                <div className="text-xs transition-all duration-300 w-fit mx-auto hover:text-indigo-400 text-indigo-200 font-semibold mt-2">رمزتو فراموش کردی؟</div>
            </Link>

            <button type="button" onClick={handleCredentialsLogin} className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4">
                <span className="text-indigo-200">ورود</span>
                <ArrowLeft className="size-6" />
            </button>

            <span className="text-sm w-fit mx-auto text-indigo-200 font-semibold mt-6">یا</span>

            <div className="flex flex-col gap-y-2">

                <button onClick={() => signIn('github')} className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4" type="button">
                    <Github className="size-6" />
                    <span className="text-indigo-200">ورود با گیت هاب</span>
                </button>
                <button onClick={() => signIn('google')} className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4" type="button">
                    <div className="size-6">
                        <GoogleIcon />
                    </div>
                    <span className="text-indigo-200">ورود با گوگل</span>
                </button>

            </div>
        </div>
    );
}

export default LoginForm;