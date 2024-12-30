'use client'

import { ArrowLeft, Github, Key, Mail } from "lucide-react";
import GoogleIcon from "./Layout/GoogleIcon";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zValidate } from "@/helpers/validation-helper";
import { loginDataSchema } from "@/database/validations/auth-validation";
import { loginReq } from "@/app/actions/auth";
import { useAppStore } from "@/store/app-store";

type Message = {
    type: 'info' | 'error' | 'success';
    body: string;
}

function LoginForm() {

    const setUser = useAppStore(state => state.setUser)

    const initInputs = {
        email: '',
        password: ''
    }
    const [inputs, setInputs] = useState(initInputs)

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<Message | null>(null)

    const initErrors = {
        email: '',
        password: ''
    }
    const [errors, setErrors] = useState(initErrors)

    const router = useRouter()


    async function loginWithProvider(provider: 'google' | 'github') {
        //login
        console.log(provider)
    }

    async function handleCredentialsLogin(event: FormEvent) {

        event.preventDefault();
        if (loading) return

        setLoading(true)
        setMessage({
            type: 'info',
            body: 'در حال ورود...'
        })

        //validate inputs
        const { hasError, errors } = zValidate(loginDataSchema, inputs)

        if (hasError) {
            setMessage({
                type: 'error',
                body: 'اطلاعات وارد شده صحیح نمی باشد'
            })
            setErrors(errors)
            setLoading(false)
            return
        }
        setErrors(initErrors)

        const result = await loginReq(inputs);

        if (result.success) {
            setUser(result.user)
            setMessage({
                type: 'success',
                body: 'با موفقیت وارد شدید. در حال ورود به حساب کاربری...'
            })
            router.push('/dashboard/profile')
            return;
        }

        if (result.statusCode === 401) {
            setMessage({
                type: 'error',
                body: 'کلمه عبور یا ایمیل اشتباه است'
            })
            setLoading(false)
            return;
        }

        setMessage({
            type: 'error',
            body: 'خطا در ورود به حساب کاربری'
        })
        setLoading(false)

    }

    return (
        <form onSubmit={handleCredentialsLogin} className="mt-6 flex flex-col gap-y-2">

            {message && (
                <p className={`block text-center my-4 ${message.type === 'error' ? 'text-red-500' : message.type === 'success' ? 'text-green-600' : 'text-gray-300'} text-base font-semibold`}>{message.body}</p>
            )}

            <div className="flex flex-row w-fit mx-auto rounded-full bg-black/40 overflow-hidden">
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


            <div className="flex flex-row w-fit mx-auto rounded-full bg-black/40 overflow-hidden">
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

            <button type="submit" className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4">
                <span className="text-indigo-200">ورود</span>
                <ArrowLeft className="size-6" />
            </button>

            <span className="text-sm w-fit mx-auto text-indigo-200 font-semibold mt-6">یا</span>

            <div className="flex flex-col gap-y-2">

                <button onClick={() => loginWithProvider('github')} className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4" type="button">
                    <Github className="size-6" />
                    <span className="text-indigo-200">ورود با گیت هاب</span>
                </button>
                <button onClick={() => loginWithProvider('google')} className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4" type="button">
                    <div className="size-6">
                        <GoogleIcon />
                    </div>
                    <span className="text-indigo-200">ورود با گوگل</span>
                </button>

            </div>
        </form>
    );
}

export default LoginForm;