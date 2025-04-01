'use client'

import useStore from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuickAcessMenu from "../../../../components/Layout/QuickAcessMenu";
import useWidth from "@/hooks/useWidth";
import { motion } from "framer-motion";

function Layout({ children }: { children: React.ReactNode }) {
    const { setUser, setSettings, isMenuMinimized, redirecting, setRedirecting } = useStore()

    const router = useRouter();
    const pathname = usePathname();
    const { width } = useWidth()

    // Prevent hydration errors
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (redirecting) {
            setRedirecting(false);
        }
    }, [pathname]);

    // Skeleton Loader
    if (!mounted) {
        return (
            <div className="w-full h-[600px] flex flex-col lg:flex-row lg:flex-nowrap">
                {/* Left content skeleton */}
                <div className="w-[80%] flex-1 space-y-4">
                    <div className='events_container'>
                        {/* Header Skeleton */}
                        <div className='events_header_container flex justify-between items-center'>
                            {/* Left (Title) */}
                            <div className="event_header_right h-10">
                                <div className='w-40 h-6 animate-pulse bg-gray-300 dark:bg-gray-700 rounded'></div>
                            </div>

                            {/* Right (Buttons) */}
                            <div className="event_header_left flex gap-x-2">
                                <div className="w-24 h-8 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="w-10 h-8 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="w-32 h-8 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>

                        {/* Events List Skeleton */}
                        <ul className="events_list pb-10">
                            {/* Ongoing Events Section */}
                            <li className='flex flex-row justify-between items-center text-gray-500 dark:text-gray-400 text-lg p-5'>
                                <div className="flex flex-row gap-x-2 items-center">
                                    <div className="w-6 h-6 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    <div className="w-32 h-5 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                </div>
                                <div className="w-12 h-4 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </li>

                            {/* Ongoing Event Items Skeletons */}
                            {[...Array(3)].map((_, index) => (
                                <li key={index} className="event_item border-b app_border_color p-4 flex justify-between items-center">
                                    <div className="event_item_right flex items-center gap-x-3">
                                        <div className="w-10 h-10 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                        <div className="flex flex-col gap-y-2">
                                            <div className="w-32 h-5 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            <div className="flex flex-row gap-x-2">
                                                <div className="w-16 h-3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                <div className="w-16 h-3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="event_item_left flex items-center gap-x-3">
                                        <div className="w-20 h-4 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="w-6 h-6 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                        <div className="hidden lg:block w-24 h-8 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </li>
                            ))}

                            {/* Ended Events Section */}
                            <li className='flex flex-row justify-between items-center text-gray-500 dark:text-gray-400 text-lg p-5'>
                                <div className="flex flex-row gap-x-2 items-center">
                                    <div className="w-6 h-6 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    <div className="w-32 h-5 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                </div>
                                <div className="w-12 h-4 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </li>

                            {/* Ended Event Items Skeletons */}
                            {[...Array(2)].map((_, index) => (
                                <li key={index} className="event_item border-b app_border_color p-4 flex justify-between items-center">
                                    <div className="event_item_right flex items-center gap-x-3">
                                        <div className="w-10 h-10 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                        <div className="flex flex-col gap-y-2">
                                            <div className="w-32 h-5 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            <div className="flex flex-row gap-x-2">
                                                <div className="w-16 h-3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                <div className="w-16 h-3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="event_item_left flex items-center gap-x-3">
                                        <div className="w-20 h-4 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="w-6 h-6 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                        <div className="hidden lg:block w-24 h-8 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>


                </div>

                {/* Sidebar skeleton */}
                <aside className="w-1/5 lg:w-[20%] h-full border-r app_border_color">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-center border-b p-4 app_border_color mb-6">
                        <div className="flex items-center gap-x-2">
                            <div className="w-6 h-6 bg-gray-300 animate-pulse dark:bg-gray-700 rounded"></div>
                            <div className="w-24 h-6 bg-gray-300 animate-pulse dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 animate-pulse dark:bg-gray-700 rounded"></div>
                    </div>

                    {/* Menu Items Skeleton */}
                    <ul className="space-y-4 p-4">
                        {[...Array(7)].map((_, index) => (
                            <li key={index} className="flex items-center gap-x-3">
                                <div className="w-6 h-6 bg-gray-300 animate-pulse dark:bg-gray-700 rounded"></div>
                                <div className="w-32 h-6 bg-gray-300 animate-pulse dark:bg-gray-700 rounded"></div>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`w-full flex flex-col lg:flex-row lg:flex-nowrap`}
        >
            <motion.section
                initial={{ x: -20, opacity: 0, width: width < 1024 ? '100%' : isMenuMinimized ? '95%' : '80%' }}
                animate={{ x: 0, opacity: 1, width: width < 1024 ? '100%' : isMenuMinimized ? '95%' : '80%' }}
                transition={{ duration: 0.2 }}
                className={`app_border_color border-b lg:border-b-0 lg:border-l`}
            >
                {children}
            </motion.section>

            <QuickAcessMenu />

            {redirecting && (
                <div className="fixed px-3 py-1.5 z-[9999] bottom-16 right-8 rounded-full flex flex-row items-center gap-x-1 bg-gray-300/30 dark:bg-gray-700/30 backdrop-blur-lg">
                    <span className="h-4 w-4 bg-gray-400 dark:bg-gray-600 animate-spin rounded-full"></span>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>در حال تغییر صفحه...</span>
                </div>
            )}
        </motion.section>
    );
}

export default Layout;
