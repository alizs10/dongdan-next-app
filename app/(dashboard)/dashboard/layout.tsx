'use client'

import { getLoggedInUserReq, logoutReq } from "@/app/actions/auth";
import { useAppStore } from "@/store/app-store";
import { useToastStore } from "@/store/toast-store";
import { BookOpenCheck, CalendarRange, Headset, Info, LogOut, Settings2, Trash, User, Users, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Layout({ children }: { children: React.ReactNode }) {

    const { setUser, setSettings } = useAppStore(state => state)
    const router = useRouter();

    useEffect(() => {

        async function getUserData() {

            const res = await getLoggedInUserReq()

            console.log(res.user)
            if (res.success) {
                setUser(res.user)
                setSettings(res.user.settings)
                return;
            }
            router.push('/auth?form=login');
        }

        getUserData()

    }, [])

    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const addToast = useToastStore((state) => state.addToast);

    async function handleLogout() {

        if (loading) return;
        setLoading(true)

        const response = await logoutReq();

        if (response.success) {
            setLoading(false)
            router.push('/');
            return;
        }

        setLoading(false)
        addToast({

            message: 'خطا در خروج از حساب کاربری',
            type: 'danger' as const,
        })
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-5">
            <section className="app_border_color border-b lg:border-b-0 col-span-4 lg:border-l">
                {children}
            </section>

            <aside className="top-20 pb-8 sticky col-span-1 app_bg_color h-fit">
                <div className="flex flex-row items-center gap-x-2 xl:gap-x-4 px-5 py-5 primary_text_color">
                    <Zap className="size-4 xl:size-5" />
                    <h1 className="text-base xl:text-lg">دسترسی سریع</h1>
                </div>

                <ul>
                    <li className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${pathname === '/dashboard/events' ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                        <Link className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full" href={'/dashboard/events'}>
                            <CalendarRange className="size-4 xl:size-5" />
                            <span>رویداد ها</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${pathname === '/dashboard/events/contacts' ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                        <Link className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full" href={'/dashboard/events/contacts'}>
                            <Users className="size-4 xl:size-5" />
                            <span>دوستان</span>
                        </Link>
                    </li>

                    {pathname.includes('/dashboard/events') && (
                        <li className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${(pathname === '/dashboard/events/trash' || pathname === '/dashboard/events/contacts/trash') ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                            <Link className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full" href={pathname === '/dashboard/events' ? '/dashboard/events/trash' : '/dashboard/events/contacts/trash'}>
                                <Trash className="size-4 xl:size-5" />
                                <span>سطل زباله</span>
                            </Link>
                        </li>
                    )}
                    <li className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${pathname === '/dashboard/guide' ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                        <Link className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full" href={'/dashboard/guide'}>
                            <BookOpenCheck className="size-4 xl:size-5" />
                            <span>راهنمای استفاده</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${pathname === '/dashboard/contact' ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                        <Link className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full" href={'/dashboard/contact'}>
                            <Headset className="size-4 xl:size-5" />
                            <span>ارتباط با ما</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${pathname === '/dashboard/about' ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                        <Link className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full" href={'/dashboard/about'}>
                            <Info className="size-4 xl:size-5" />
                            <span>درباره</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${pathname === '/dashboard/settings' ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                        <Link className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full" href={'/dashboard/settings'}>
                            <Settings2 className="size-4 xl:size-5" />
                            <span>تنظیمات</span>
                        </Link>
                    </li>
                    <li className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${pathname === '/dashboard/profile' ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                        <Link className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full" href={'/dashboard/profile'}>
                            <User className="size-4 xl:size-5" />
                            <span>پروفایل کاربری</span>
                        </Link>
                    </li>
                    <li onClick={handleLogout} className={`border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${pathname === '/dashboard/logout' ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10' : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400  hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'}`}>
                        <div className="flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full">
                            <LogOut className="size-4 xl:size-5" />
                            <span>خروج از حساب</span>
                        </div>
                    </li>

                </ul>

            </aside>
        </section>
    );
}

export default Layout;