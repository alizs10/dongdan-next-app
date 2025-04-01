'use client'

import { logoutReq } from '@/app/actions/auth';
import useStore from '@/store/store';
import { BookOpenCheck, CalendarRange, Headset, Info, LogOut, Maximize2, Minimize2, Settings2, Trash, User, Users, Zap } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation';
import { memo, useState } from 'react'
// import TrackedLink from 'next/TrackedLink';
import { motion, AnimatePresence } from 'framer-motion';
import useWidth from '@/hooks/useWidth';
import Tooltip from '@/components/Common/Tooltip';
import TrackedLink from '@/components/Common/TrackedLinks';

interface ListItemProps {
    href?: string;
    icon: React.ReactNode;
    text: string;
    isActive: boolean;
    isMenuMinimized: boolean;
    onClick?: () => void;
    width: number;
}

const Content = memo(({ icon, text, isMenuMinimized, width }: Pick<ListItemProps, "icon" | "text" | "isMenuMinimized" | "width">) => (
    <>
        {icon}
        <AnimatePresence mode="popLayout">
            {(!isMenuMinimized || width < 1024) && (
                <motion.span
                    key={text} // Ensure animation only runs when text changes
                    initial={{ opacity: 0, x: -10, width: 0, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, width: 'auto', scale: 1 }}
                    exit={{ opacity: 0, x: -10, width: 0, scale: 0.8 }}
                    transition={{
                        duration: 0.2,
                        ease: "easeOut"
                    }}
                    className="whitespace-nowrap"
                >
                    {text}
                </motion.span>
            )}
        </AnimatePresence>
    </>
));

const ListItem = memo(({ href, icon, text, isActive, isMenuMinimized, onClick, width }: ListItemProps) => {
    const className = `border-r-2 transition-all duration-300 text-sm xl:text-base cursor-pointer ${isActive
        ? 'border-indigo-800 dark:border-600 primary_text_color bg-indigo-50 dark:bg-indigo-600/10'
        : 'hover:border-r-2 border-r-transparent text-gray-500 dark:text-gray-400 hover:border-r-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 hover:text-indigo-800 dark:hover:text-indigo-600'
        }`;

    const contentClassName = `flex flex-row items-center gap-x-2 px-5 py-3 w-full h-full ${isMenuMinimized && width > 1024 ? 'justify-center' : ''
        }`;

    return isMenuMinimized ? (
        <Tooltip text={text} key={text} position="right">
            <li className={className}>
                {href ? (
                    <TrackedLink className={contentClassName} href={href}>
                        <Content icon={icon} text={text} isMenuMinimized={isMenuMinimized} width={width} />
                    </TrackedLink>
                ) : (
                    <div onClick={onClick} className={contentClassName}>
                        <Content icon={icon} text={text} isMenuMinimized={isMenuMinimized} width={width} />
                    </div>
                )}
            </li>
        </Tooltip>
    ) : (
        <li className={className}>
            {href ? (
                <TrackedLink className={contentClassName} href={href}>
                    <Content icon={icon} text={text} isMenuMinimized={isMenuMinimized} width={width} />
                </TrackedLink>
            ) : (
                <div onClick={onClick} className={contentClassName}>
                    <Content icon={icon} text={text} isMenuMinimized={isMenuMinimized} width={width} />
                </div>
            )}
        </li>
    );
});

// ListItem.displayName = 'ListItem';

export default function QuickAcessMenu() {
    const { setUser, addToast, isMenuMinimized, setIsMenuMinimized } = useStore()
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
            setUser(null)
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

            className={`pb-8 lg:sticky lg:top-20 app_bg_color h-fit`}>


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
                    width={width}
                />
                <ListItem
                    href="/dashboard/events/contacts"
                    icon={<Users className="size-4 xl:size-5" />}
                    text="دوستان"
                    isActive={pathname === '/dashboard/events/contacts'}
                    isMenuMinimized={isMenuMinimized}
                    width={width}
                />
                <ListItem
                    href={pathname === '/dashboard/events/contacts' ? '/dashboard/events/contacts/trash' : '/dashboard/events/trash'}
                    icon={<Trash className="size-4 xl:size-5" />}
                    text="سطل زباله"
                    isActive={pathname === '/dashboard/events/trash' || pathname === '/dashboard/events/contacts/trash'}
                    isMenuMinimized={isMenuMinimized}
                    width={width}
                />
                <ListItem
                    href="/dashboard/events/guide"
                    icon={<BookOpenCheck className="size-4 xl:size-5" />}
                    text="راهنمای استفاده"
                    isActive={pathname === '/dashboard/events/guide'}
                    isMenuMinimized={isMenuMinimized}
                    width={width}
                />
                <ListItem
                    href="/dashboard/events/contact"
                    icon={<Headset className="size-4 xl:size-5" />}
                    text="ارتباط با ما"
                    isActive={pathname === '/dashboard/events/contact'}
                    isMenuMinimized={isMenuMinimized}
                    width={width}
                />
                <ListItem
                    href="/dashboard/events/about"
                    icon={<Info className="size-4 xl:size-5" />}
                    text="درباره"
                    isActive={pathname === '/dashboard/events/about'}
                    isMenuMinimized={isMenuMinimized}
                    width={width}
                />
                <ListItem
                    href="/dashboard/events/settings"
                    icon={<Settings2 className="size-4 xl:size-5" />}
                    text="تنظیمات"
                    isActive={pathname === '/dashboard/events/settings'}
                    isMenuMinimized={isMenuMinimized}
                    width={width}
                />
                <ListItem
                    icon={<LogOut className="size-4 xl:size-5" />}
                    text="خروج از حساب"
                    isActive={false}
                    isMenuMinimized={isMenuMinimized}
                    onClick={handleLogout}
                    width={width}
                />
            </ul>
        </motion.aside>
    )
}
