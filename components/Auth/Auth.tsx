'use client'

import { ArrowLeft, Key, Mail, MoveLeft, User } from "lucide-react";
import { useEffect, useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useRouter, useSearchParams } from "next/navigation";

function Auth() {

    const searchParams = useSearchParams()
    const form = searchParams.get('form')
    const router = useRouter()
    const [formType, setFormType] = useState(form === 'login' ? 1 : 0) // 0 for register, 1 for login

    useEffect(() => {

        if (!form || (form && !['login', 'register'].includes(form))) {
            router.replace('/auth?form=login')
        }

        setFormType(form === 'login' ? 1 : 0)

    }, [form])



    return (
        <div className="w-4/5 lg:w-3/5 aspect-video flex flex-col gap-y-2 justify-center items-center">

            <div className="rounded-full w-44 aspect-square bg-black/20 flex justify-center items-center">
                <User className="size-24 text-indigo-200" />
            </div>

            <h1 className="text-xl font-bold text-indigo-100 mt-4">خوش اومدی، دوست خوب من!</h1>


            {formType === 0 ? <RegisterForm /> : <LoginForm />}



            <div className="mt-20 rounded-full bg-black/10 overflow-hidden backdrop-blur-sm flex flex-wrap">
                <button onClick={() => router.push('/auth?form=register')} className={`w-24 text-sm bg-transparent transition-all duration-300 py-3 flex justify-center items-center ${formType === 0 ? 'bg-indigo-600 text-white' : 'text-indigo-200'}`} type="button">ثبت نام</button>
                <div className="flex h-full w-0.5 bg-indigo-700 justify-center items-center">
                </div>
                <button onClick={() => router.push('/auth?form=login')} className={`w-24 text-sm bg-transparent transition-all duration-300 py-3 flex justify-center items-center ${formType === 1 ? 'bg-indigo-600 text-white' : 'text-indigo-200'}`} type="button">ورود</button>
            </div>

        </div>
    );
}

export default Auth;