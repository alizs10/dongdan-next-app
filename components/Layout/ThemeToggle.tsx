'use client'

import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle() {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false)

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // Prevents rendering until client-side
    }

    return (
        <button onClick={toggleTheme} className="header_left_button">
            {theme === 'light' ? <SunDim className="size-6" /> : <Moon className="size-6" />}
        </button>
    );
}

export default ThemeToggle;