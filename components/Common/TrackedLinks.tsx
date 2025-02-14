// 'use client'

import useStore from '@/store/store';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface TrackedLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
}

const TrackedLink: React.FC<TrackedLinkProps> = ({ children, ...props }) => {

    const { setRedirecting } = useStore();
    const pathname = usePathname()

    const handleClick = (e: React.MouseEvent) => {
        if (pathname === props.href) return
        setRedirecting(true);
    };

    return (
        <Link {...props} onClick={handleClick} passHref>
            {children}
        </Link>
    );
};

export default TrackedLink;
