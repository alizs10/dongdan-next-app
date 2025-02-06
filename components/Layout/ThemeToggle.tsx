'use client'

import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggleSkeleton() {
    return (
        <div className="header_left_button">
            <div className="size-6 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        </div>
    )
}

function ThemeToggle() {

    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        }
    }, [])

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    if (!mounted) {
        return <ThemeToggleSkeleton />
    }

    return (
        <button
            onClick={toggleTheme}
            className="header_left_button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            {theme === 'light' ?
                <SunDim className="size-6" aria-hidden="true" /> :
                <Moon className="size-6" aria-hidden="true" />
            }
        </button>
    );
}

export default ThemeToggle;