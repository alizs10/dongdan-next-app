'use client'

import Button from "@/components/Common/Button";
import { Copy, CopyCheck } from "lucide-react";
import { useEffect, useState } from "react";

function ShareEventLink() {

    const [copied, setCopied] = useState(false);

    function copyLink() {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
    }

    useEffect(() => {

        let timer: NodeJS.Timeout;

        if (copied) {
            timer = setTimeout(() => {
                setCopied(false);
            }, 5000);
        }

        return () => {
            timer && clearTimeout(timer);
        }

    }, [copied])

    return (
        <div className="flex w-full justify-between items-center">
            <h1 className="text-sm text-gray-500">اشتراک گذاری رویداد</h1>
            <Button
                text={copied ? 'کپی شد' : 'کپی لینک'}
                color={copied ? 'success' : 'gray'}
                onClick={copyLink}
                size="small"
                icon={copied ? <CopyCheck className="size-4" /> : <Copy className="size-4" />}
            />
        </div>
    );
}

export default ShareEventLink;