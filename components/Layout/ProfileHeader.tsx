'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import useStore from '@/store/store';
import { logoutReq } from '@/app/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';
import TrackedLink from '@/components/Common/TrackedLinks';
import useClickOutside from '@/hooks/useOutsideClick';

const ProfileHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser, addToast } = useStore();
    const router = useRouter();
    const [logoutLoading, setLogoutLoading] = useState(false)
    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        if (logoutLoading) return
        setLogoutLoading(true)

        try {
            const res = await logoutReq();
            if (res.success) {
                addToast({
                    message: 'با موفقیت خارج شدید',
                    type: 'success',
                });
                setUser(null)
                setLogoutLoading(false)
                router.push('/');
            } else {
                setLogoutLoading(false)
                addToast({
                    message: 'مشکلی در خروج از حساب پیش آمده است',
                    type: 'danger',
                });
            }
        } catch (error) {
            setLogoutLoading(false)
            addToast({
                message: 'مشکلی در خروج از حساب پیش آمده است',
                type: 'danger',
            });
        }
    };

    const dropdownRef = useClickOutside(() => setIsOpen(false))

    if (!user) return;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
            >
                <div className={`w-7 h-7 rounded-full user_avatar_${user.scheme}_border flex items-center justify-center`}>
                    <User className={`w-4 h-4 user_avatar_${user.scheme}_text`} />
                </div>
                {user && (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                        {user.name || user.email}
                    </span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute overflow-hidden right-0 mt-8 w-48 bg-white dark:bg-gray-800 rounded-3xl z-50 border border-gray-200 dark:border-gray-700"
                    >
                        <TrackedLink
                            href="/dashboard/profile"
                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <User className="w-4 h-4" />
                            پروفایل کاربری
                        </TrackedLink>
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LogOut className="w-4 h-4" />
                            {logoutLoading ? 'در حال خروج...' : 'خروج'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileHeader;
