
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import useStore from "@/store/store";


type PropsTypes = {
    toastId: string;
    scheme?: 'success' | 'danger' | 'warning' | 'accent' | 'info';
    text: string;
    i: number;
}

function Toast({ toastId, scheme, text, i }: PropsTypes) {

    const { removeToast } = useStore();

    useEffect(() => {

        const timer = setTimeout(() => {
            removeToast(toastId);
        }, 5000);

        return () => {
            clearTimeout(timer);
        }

    }, [toastId, removeToast])


    const schemeClasses = scheme === 'success' ? "bg-green-50 dark:bg-dark-green text-green-700 dark:text-green-300 border-green-700 dark:border-green-300" : scheme === 'danger' ? 'bg-red-50 dark:bg-dark-red text-red-600 dark:text-red-300 border-red-600 dark:border-red-300' : scheme === 'warning' ? 'bg-yellow-50 dark:bg-dark-yellow text-yellow-600 dark:text-yellow-200 border-yellow-600 dark:border-yellow-200' : scheme === 'accent' ? 'bg-indigo-50 text-indigo-700 border-indigo-700' : 'app_bg_color text-gray-500 border-gray-300';


    const icon = scheme === 'success' ? <CircleCheck className="size-7" /> : scheme === 'danger' ? <TriangleAlert className="size-7" /> : scheme === 'warning' ? <CircleAlert className="size-7" /> : scheme === 'info' ? <Info className="size-7" /> : <CircleCheck className="size-7" />;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100, zIndex: 1002 - i }}
            animate={{ opacity: 1, scale: 1 - i * .1, y: 0 - i * 30, zIndex: 1002 - i }}
            exit={{ opacity: 0, scale: 0.5, y: -100, zIndex: 1002 - i }}
            className={`absolute top-0 left-0 w-full h-fit rounded-full px-5 py-3 border shadow-md flex flex-row justify-between items-center ${schemeClasses}`}>
            <div className="flex flex-row gap-x-3 items-center">
                {icon}
                <span className="text-sm lg:text-base line-clamp-1 text-ellipsis">{text}</span>
            </div>
            <button onClick={() => removeToast(toastId)} type="button" className="p-1 mr-5 transition-all duration-300 opacity-50 hover:opacity-100">
                <X className="size-5" />
            </button>
        </motion.div>
    );
}

export default Toast;