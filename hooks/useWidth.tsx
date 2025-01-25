import { useEffect, useState } from "react";

type BreakPoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export default function useWidth() {

    const [width, setWidth] = useState(window.innerWidth);
    const [breakPKey, setBreakPKey] = useState<BreakPoints>(() => {
        const windowWidth = window.innerWidth;
        if (windowWidth < 480) return 'xs';
        else if (windowWidth < 640) return 'sm';
        else if (windowWidth < 768) return 'md';
        else if (windowWidth < 1024) return 'lg';
        else if (windowWidth < 1280) return 'xl';
        else return '2xl';
    });

    useEffect(() => {
        function handleResize() {
            const windowWidth = window.innerWidth;
            setWidth(windowWidth);

            if (windowWidth < 480) setBreakPKey('xs');
            else if (windowWidth < 640) setBreakPKey('sm');
            else if (windowWidth < 768) setBreakPKey('md');
            else if (windowWidth < 1024) setBreakPKey('lg');
            else if (windowWidth < 1280) setBreakPKey('xl');
            else setBreakPKey('2xl');
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { width, breakPKey };
}
