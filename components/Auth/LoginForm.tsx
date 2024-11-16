import { ArrowLeft, Key, Mail } from "lucide-react";

function LoginForm() {
    return (
        <div className="mt-6 flex flex-col gap-y-2">
            <div className="flex flex-wrap rounded-full bg-black/40 overflow-hidden">
                <div className="px-6 flex justify-center items-center">
                    <Mail className="size-6 text-indigo-200" />
                </div>
                <input
                    className="bg-transparent font-sans placeholder:text-gray-400 placeholder:font-[estedadFD] placeholder:font-normal text-indigo-200 px-5 py-3 text-lg font-bold focus:outline-none"
                    type="text"
                    name="email"
                    dir="ltr"
                    placeholder="ایمیل شما"
                />
            </div>
            <div className="flex flex-wrap rounded-full bg-black/40 overflow-hidden">
                <div className="px-6 flex justify-center items-center">
                    <Key className="size-6 text-indigo-200" />
                </div>
                <input
                    className="bg-transparent font-sans placeholder:text-gray-400 placeholder:font-[estedadFD] placeholder:font-normal text-indigo-200 px-5 py-3 text-lg font-bold focus:outline-none"
                    type="password"
                    name="password"
                    dir="ltr"
                    placeholder="رمز عبور"

                />
            </div>

            <button className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4" type="button">
                <span className="text-indigo-200">ورود</span>
                <ArrowLeft className="size-6" />
            </button>


            <button className="text-sm transition-all duration-300 w-fit mx-auto hover:text-indigo-400 text-indigo-200 font-semibold mt-6">رمزتو فراموش کردی؟</button>
        </div>
    );
}

export default LoginForm;