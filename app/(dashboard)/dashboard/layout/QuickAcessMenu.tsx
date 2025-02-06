'use client'

import { logoutReq } from '@/app/actions/auth';
import useStore from '@/store/store';
import { BookOpenCheck, CalendarRange, Headset, Info, LogOut, Maximize2, Minimize2, Settings2, Trash, User, Users, Zap } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react'
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import useWidth from '@/hooks/useWidth';

interface ListItemProps {
    href?: string;
    icon: React.ReactNode;
    text: string;
    isActive: boolean;
    isMenuMinimized: boolean;
    onClick?: () => void;
}

function ListItem({ href, icon, text, isActive, isMenuMinimized, onClick }: ListItemProps) {
    const { width } = useWidth();
    const Content = () => (
        <>
            {icon}
            <AnimatePresence>

                {(!isMenuMinimized || width < 1024) && (
                    <motion.span
                        initial={{ opacity: 0, x: -10, width: 0, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, width: 'auto', scale: 1 }}
                        exit={{ opacity: 0, x: -10, width: 0, scale: 0.8 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut"
                        }}
                        className="whitespace-nowrap"
                    >{text}</motion.span>
                )}
            </AnimatePresence>
        </>
    )

    const className = `border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${isActive
        ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10'
        : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400 hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'
        }`

    const contentClassName = `flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full ${(isMenuMinimized && width > 1024) ? 'justify-center' : ''}`

    return (
        <li className={className}>
            {href ? (
                <Link className={contentClassName} href={href}>
                    <Content />
                </Link>
            ) : (
                <div onClick={onClick} className={contentClassName}>
                    <Content />
                </div>
            )}
        </li>
    )
}

export default function QuickAcessMenu() {
    const { addToast, isMenuMinimized, setIsMenuMinimized } = useStore()
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    function toggleMenu() {
        setIsMenuMinimized(!isMenuMinimized)
    }

    const { width } = useWidth();

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
        <motion.aside
            initial={{ width: width < 1024 ? '100%' : isMenuMinimized ? '5%' : '20%' }}
            animate={{ width: width < 1024 ? '100%' : isMenuMinimized ? '5%' : '20%' }}
            transition={{ duration: 0.2 }}

            className={`top-20 pb-8 sticky app_bg_color h-fit`}>


            <div className={`w-full relative flex flex-row ${(isMenuMinimized && width > 1024) ? 'justify-center' : 'justify-between'} items-center h-14 lg:h-18 px-5 py-8`}>
                <AnimatePresence>
                    {(!isMenuMinimized || width < 1024) && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-row items-center gap-x-2 xl:gap-x-4 primary_text_color"
                        >
                            <Zap className="size-4 xl:size-5" />
                            <h1 className="whitespace-nowrap text-base xl:text-lg">دسترسی سریع</h1>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {isMenuMinimized ? (
                        <button
                            onClick={toggleMenu}
                            className="hidden lg:block p-2 rounded-xl transition-all duration-300 hover:bg-gray-200/30 dark:hover:bg-gray-700/30"
                        >
                            <motion.div
                                key="maximize"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Maximize2 className='text-gray-400 dark:text-gray-600 size-4 xl:size-5' />
                            </motion.div>
                        </button>
                    ) : (
                        <button
                            onClick={toggleMenu}
                            className="hidden lg:block p-2 rounded-xl transition-all duration-300 hover:bg-gray-200/30 dark:hover:bg-gray-700/30"
                        >
                            <motion.div
                                key="minimize"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Minimize2 className='text-gray-400 dark:text-gray-600 size-4 xl:size-5' />
                            </motion.div>
                        </button>
                    )}
                </AnimatePresence>
            </div>

            <ul>
                <ListItem
                    href="/dashboard/events"
                    icon={<CalendarRange className="size-4 xl:size-5" />}
                    text="رویداد ها"
                    isActive={pathname === '/dashboard/events'}
                    isMenuMinimized={isMenuMinimized}
                />
                <ListItem
                    href="/dashboard/events/contacts"
                    icon={<Users className="size-4 xl:size-5" />}
                    text="دوستان"
                    isActive={pathname === '/dashboard/events/contacts'}
                    isMenuMinimized={isMenuMinimized}
                />
                {pathname.includes('/dashboard/events') && (
                    <ListItem
                        href={pathname === '/dashboard/events' ? '/dashboard/events/trash' : '/dashboard/events/contacts/trash'}
                        icon={<Trash className="size-4 xl:size-5" />}
                        text="سطل زباله"
                        isActive={pathname === '/dashboard/events/trash' || pathname === '/dashboard/events/contacts/trash'}
                        isMenuMinimized={isMenuMinimized}
                    />
                )}
                <ListItem
                    href="/dashboard/guide"
                    icon={<BookOpenCheck className="size-4 xl:size-5" />}
                    text="راهنمای استفاده"
                    isActive={pathname === '/dashboard/guide'}
                    isMenuMinimized={isMenuMinimized}
                />
                <ListItem
                    href="/dashboard/contact"
                    icon={<Headset className="size-4 xl:size-5" />}
                    text="ارتباط با ما"
                    isActive={pathname === '/dashboard/contact'}
                    isMenuMinimized={isMenuMinimized}
                />
                <ListItem
                    href="/dashboard/about"
                    icon={<Info className="size-4 xl:size-5" />}
                    text="درباره"
                    isActive={pathname === '/dashboard/about'}
                    isMenuMinimized={isMenuMinimized}
                />
                <ListItem
                    href="/dashboard/settings"
                    icon={<Settings2 className="size-4 xl:size-5" />}
                    text="تنظیمات"
                    isActive={pathname === '/dashboard/settings'}
                    isMenuMinimized={isMenuMinimized}
                />
                <ListItem
                    href="/dashboard/profile"
                    icon={<User className="size-4 xl:size-5" />}
                    text="پروفایل کاربری"
                    isActive={pathname === '/dashboard/profile'}
                    isMenuMinimized={isMenuMinimized}
                />
                <ListItem
                    icon={<LogOut className="size-4 xl:size-5" />}
                    text="خروج از حساب"
                    isActive={false}
                    isMenuMinimized={isMenuMinimized}
                    onClick={handleLogout}
                />
            </ul>
        </motion.aside>
    )
}
