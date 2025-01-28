'use client';

import { usePathname } from "next/navigation";
import Wave6 from "../Common/Wave6";

function FooterWave() {

    const pathname = usePathname();

    if (pathname.includes('dashboard')) {
        return null;
    }

    return (
        <div className="absolute top-0 -translate-y-[95%] left-0 w-full">
            <Wave6 />
        </div>

    );
}

export default FooterWave;
