import { BookOpenCheck, Headset, Info, LogOut, Settings2, Trash, User } from "lucide-react";

function layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="grid grid-cols-5">
            <section className="col-span-4">
                {children}
            </section>
            <aside className="col-span-1 border-r border-gray-200">

                <h1 className="text-indigo-800 px-5 py-5 text-lg">منو</h1>

                <ul>
                    <li className="flex flex-row items-center gap-x-2 px-5 py-3 text-gray-500 transition-all duration-300 hover:text-indigo-800 text-base hover:border-r-2 border-r-2 border-r-transparent hover:border-r-indigo-800 hover:bg-indigo-50 cursor-pointer">
                        <User className="size-5" />
                        <span>پروفایل کاربری</span>
                    </li>
                    <li className="flex flex-row items-center gap-x-2 px-5 py-3 text-gray-500 transition-all duration-300 hover:text-indigo-800 text-base hover:border-r-2 border-r-2 border-r-transparent hover:border-r-indigo-800 hover:bg-indigo-50 cursor-pointer">
                        <Trash className="size-5" />
                        <span>سطل زباله</span>
                    </li>
                    <li className="flex flex-row items-center gap-x-2 px-5 py-3 text-gray-500 transition-all duration-300 hover:text-indigo-800 text-base hover:border-r-2 border-r-2 border-r-transparent hover:border-r-indigo-800 hover:bg-indigo-50 cursor-pointer">
                        <BookOpenCheck className="size-5" />
                        <span>راهنمای استفاده</span>
                    </li>
                    <li className="flex flex-row items-center gap-x-2 px-5 py-3 text-gray-500 transition-all duration-300 hover:text-indigo-800 text-base hover:border-r-2 border-r-2 border-r-transparent hover:border-r-indigo-800 hover:bg-indigo-50 cursor-pointer">
                        <Headset className="size-5" />
                        <span>ارتباط با ما</span>
                    </li>
                    <li className="flex flex-row items-center gap-x-2 px-5 py-3 text-gray-500 transition-all duration-300 hover:text-indigo-800 text-base hover:border-r-2 border-r-2 border-r-transparent hover:border-r-indigo-800 hover:bg-indigo-50 cursor-pointer">
                        <Settings2 className="size-5" />
                        <span>تنظیمات</span>
                    </li>
                    <li className="flex flex-row items-center gap-x-2 px-5 py-3 text-gray-500 transition-all duration-300 hover:text-indigo-800 text-base hover:border-r-2 border-r-2 border-r-transparent hover:border-r-indigo-800 hover:bg-indigo-50 cursor-pointer">
                        <Info className="size-5" />
                        <span>درباره</span>
                    </li>
                    <li className="flex flex-row items-center gap-x-2 px-5 py-3 text-gray-500 transition-all duration-300 hover:text-indigo-800 text-base hover:border-r-2 border-r-2 border-r-transparent hover:border-r-indigo-800 hover:bg-indigo-50 cursor-pointer">
                        <LogOut className="size-5" />
                        <span>خروج از حساب</span>
                    </li>
                </ul>

            </aside>
        </section>
    );
}

export default layout;