import { User } from "lucide-react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";
import Link from "next/link";

function Auth({ form }: { form: string | string[] | undefined }) {


    if (!form || (form && typeof form === 'string' && !['login', 'register'].includes(form))) {
        redirect('/auth?form=login');
    }

    const formType = form === 'login' ? 1 : 0; // 0 for register, 1 for login

    return (
        <div className="w-4/5 lg:w-3/5 aspect-video flex flex-col gap-y-2 justify-center items-center">

            <div className="rounded-full w-44 aspect-square bg-black/20 flex justify-center items-center">
                <User className="size-24 text-indigo-200" />
            </div>

            <h1 className="text-xl font-bold text-indigo-100 mt-4">خوش اومدی، دوست خوب من!</h1>

            {formType === 0 ? <RegisterForm /> : <LoginForm />}

            <div className="mt-20 rounded-full bg-black/10 overflow-hidden backdrop-blur-sm flex flex-wrap">
                <Link href="/auth?form=register" className={`w-24 text-sm transition-all duration-300 py-3 flex justify-center items-center ${formType === 0 ? 'bg-indigo-600 text-white' : 'bg-transparent text-indigo-200'}`}>ثبت نام</Link>
                <div className="flex h-full w-0.5 bg-indigo-700 justify-center items-center">
                </div>
                <Link href="/auth?form=login" className={`w-24 text-sm transition-all duration-300 py-3 flex justify-center items-center ${formType === 1 ? 'bg-indigo-600 text-white' : 'bg-transparent text-indigo-200'}`}>ورود</Link>
            </div>

        </div>
    );
}

export default Auth;