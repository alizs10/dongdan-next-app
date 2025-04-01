'use client'

import { getLoggedInUserReq } from "@/app/actions/auth";
import useStore from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import useWidth from "@/hooks/useWidth";
import { motion } from "framer-motion";
import { Loader, PieChart, BarChart3 } from "lucide-react";
import Link from "next/link";

function Layout({ children }: { children: React.ReactNode }) {

    const { setUser, setSettings, isMenuMinimized, redirecting, setRedirecting } = useStore()

    // const router = useRouter();
    const pathname = usePathname();
    // const { width } = useWidth()

    // // init data
    // useEffect(() => {

    //     async function getUserData() {

    //         const res = await getLoggedInUserReq()

    //         console.log(res.user)
    //         if (res.success) {
    //             setUser(res.user)
    //             setSettings(res.user.settings)
    //             return;
    //         }
    //         router.push('/auth?form=login');
    //     }

    //     getUserData()

    // }, [])


    useEffect(() => {

        if (redirecting) {
            setRedirecting(false)
        }

    }, [pathname])

    return (
        <div className="flex flex-col">

            {children}


            {redirecting && (
                <div className="fixed px-3 py-1.5 z-[9999] bottom-16 right-8 rounded-full flex flex-row items-center gap-x-1 bg-gray-300/30 dark:bg-gray-700/30 backdrop-blur-lg">
                    <Loader className='size-4 animate-spin' />
                    <span className='text-xs text-gray-500 dark:text-gray-400'>در حال تغییر صفحه...</span>
                </div>
            )}
        </div>
    );

}

export default Layout;