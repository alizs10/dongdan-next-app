'use client'

import { BookOpenCheck, CalendarRange, Headset, Info, LogOut, Settings2, Trash, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function layout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();

    return (
        <section className="grid grid-cols-5 sticky top-0">
            <section className="col-span-4 border-l border-gray-200 ">
                {children}
            </section>
            <aside className="col-span-1 sticky top-0 h-fit bg-white">

                <h1 className="text-indigo-800 px-5 py-5 text-lg">دسترسی سریع</h1>

                <ul>
                    <li className={`border-r-2 transition-all duration-300  text-base cursor-pointer ${pathname === '/dashboard/events' ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                        <Link className="w-full h-full flex flex-row items-center gap-x-2  px-5 py-3" href={'/dashboard/events'}>
                            <CalendarRange className="size-5" />
                            <span>رویداد ها</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300  text-base cursor-pointer ${pathname === '/dashboard/events/contacts' ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                        <Link className="w-full h-full flex flex-row items-center gap-x-2  px-5 py-3" href={'/dashboard/events/contacts'}>
                            <Users className="size-5" />
                            <span>دوستان</span>
                        </Link>
                    </li>

                    {pathname.includes('/dashboard/events') && (
                        <li className={`border-r-2 transition-all duration-300  text-base cursor-pointer ${(pathname === '/dashboard/events/trash' || pathname === '/dashboard/events/contacts/trash') ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                            <Link className="w-full h-full flex flex-row items-center gap-x-2  px-5 py-3" href={pathname === '/dashboard/events' ? '/dashboard/events/trash' : '/dashboard/events/contacts/trash'}>
                                <Trash className="size-5" />
                                <span>سطل زباله</span>
                            </Link>
                        </li>
                    )}
                    <li className={`border-r-2 transition-all duration-300  text-base cursor-pointer ${pathname === '/dashboard/guide' ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                        <Link className="w-full h-full flex flex-row items-center gap-x-2  px-5 py-3" href={'/dashboard/guide'}>
                            <BookOpenCheck className="size-5" />
                            <span>راهنمای استفاده</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300  text-base cursor-pointer ${pathname === '/dashboard/contact' ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                        <Link className="w-full h-full flex flex-row items-center gap-x-2  px-5 py-3" href={'/dashboard/contact'}>
                            <Headset className="size-5" />
                            <span>ارتباط با ما</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300  text-base cursor-pointer ${pathname === '/dashboard/about' ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                        <Link className="w-full h-full flex flex-row items-center gap-x-2  px-5 py-3" href={'/dashboard/about'}>
                            <Info className="size-5" />
                            <span>درباره</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300  text-base cursor-pointer ${pathname === '/dashboard/settings' ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                        <Link className="w-full h-full flex flex-row items-center gap-x-2  px-5 py-3" href={'/dashboard/settings'}>
                            <Settings2 className="size-5" />
                            <span>تنظیمات</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300  text-base cursor-pointer ${pathname === '/dashboard/profile' ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                        <Link className="w-full h-full flex flex-row items-center gap-x-2  px-5 py-3" href={'/dashboard/profile'}>
                            <User className="size-5" />
                            <span>پروفایل کاربری</span>
                        </Link>
                    </li>
                    <li className={`flex flex-row items-center gap-x-2 px-5 py-3 border-r-2  transition-all duration-300  text-base cursor-pointer ${pathname.includes('/dashboard/logout') ? 'border-indigo-800 text-indigo-800 bg-indigo-50' : 'hover:border-r-2 border-r-transparent text-gray-500  hover:border-r-indigo-800 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                        <LogOut className="size-5" />
                        <span>خروج از حساب</span>
                    </li>
                </ul>

            </aside>
        </section>
    );
}

export default layout;