import { Key, Mail, MoveRight, Pen, Send } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
    return (

        <div className="w-4/5 lg:w-3/5 aspect-video flex flex-col gap-y-2 justify-center items-center">

            <div className="rounded-full w-44 aspect-square bg-black/20 flex justify-center items-center">
                <Key className="size-24 text-indigo-200" />
            </div>

            <h1 className="text-xl font-bold text-indigo-100 mt-4">بازنشانی رمز عبور</h1>


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
                        placeholder="رمز عبور جدید"
                    />
                </div>
                <div className="flex flex-wrap rounded-full bg-black/40 overflow-hidden">
                    <div className="px-6 flex justify-center items-center">
                        <Key className="size-6 text-indigo-200" />
                    </div>
                    <input
                        className="bg-transparent font-sans placeholder:text-gray-400 placeholder:font-[estedadFD] placeholder:font-normal text-indigo-200 px-5 py-3 text-lg focus:outline-none"
                        type="password"
                        name="password"
                        dir="ltr"
                        placeholder="تکرار رمز عبور"
                    />
                </div>


                <button className="flex flex-row gap-x-3 transition-all duration-300 border-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 px-5 py-3 text-lg rounded-full bg-black/40 justify-center items-center text-indigo-200 w-fit mx-auto mt-4" type="button">
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
        </div>
    );
}

export default ResetPasswordForm;