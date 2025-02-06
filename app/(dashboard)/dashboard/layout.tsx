'use client'

import { getLoggedInUserReq } from "@/app/actions/auth";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import QuickAcessMenu from "./layout/QuickAcessMenu";
import useWidth from "@/hooks/useWidth";
import { motion } from "framer-motion";

function Layout({ children }: { children: React.ReactNode }) {

    const { setUser, setSettings, isMenuMinimized } = useStore()
    const router = useRouter();

    const { width } = useWidth()

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

        </motion.section>
    );
}

export default Layout;