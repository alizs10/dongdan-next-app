'use client'

import { getLoggedInUserReq } from "@/app/actions/auth";
import useStore from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import QuickAcessMenu from "./layout/QuickAcessMenu";
import useWidth from "@/hooks/useWidth";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import useNavigationTracker from "@/hooks/useNavigationTracker";

function Layout({ children }: { children: React.ReactNode }) {

    const { setUser, setSettings, isMenuMinimized, redirecting, setRedirecting } = useStore()

    const router = useRouter();
    const pathname = usePathname();
    const { width } = useWidth()

    // init data
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


    useEffect(() => {

        if (redirecting) {
            setRedirecting(false)
        }

    }, [pathname])


    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`w-full flex flex-row ${width < 1024 ? 'flex-col' : 'flex-row flex-nowrap'}`}
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
                    <Loader className='size-4 animate-spin' />
                    <span className='text-xs text-gray-500 dark:text-gray-400'>در حال تغییر صفحه...</span>
                </div>
            )}

        </motion.section>
    );
}

export default Layout;