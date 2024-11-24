'use client'

import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {

    const { theme, setTheme } = useTheme();

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <button onClick={toggleTheme} className="header_left_button">
            {theme === 'light' ? <SunDim className="size-6" /> : <Moon className="size-6" />}
        </button>
    );
}

export default ThemeToggle;