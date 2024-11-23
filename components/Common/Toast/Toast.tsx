import { useToastStore } from "@/store/toast-store";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { useEffect } from "react";
import { motion } from 'framer-motion';


type PropsTypes = {
    toastId: string;
    scheme?: 'success' | 'danger' | 'warning' | 'accent' | 'info';
    text: string;
    i: number;
}

function Toast({ toastId, scheme, text, i }: PropsTypes) {

    const removeToast = useToastStore(state => state.removeToast);

    useEffect(() => {

        let timer = setTimeout(() => {
            removeToast(toastId);
        }, 5000);

        return () => {
            clearTimeout(timer);
        }

    }, [toastId])


    let schemeClasses = scheme === 'success' ? "bg-green-50 text-green-700 border-green-700" : scheme === 'danger' ? 'bg-red-50 text-red-600 border-red-600' : scheme === 'warning' ? 'bg-yellow-50 text-yellow-600 border-yellow-600' : scheme === 'accent' ? 'bg-indigo-50 text-indigo-700 border-indigo-700' : 'bg-white text-gray-500 border-gray-300';


    let icon = scheme === 'success' ? <CircleCheck className="size-7" /> : scheme === 'danger' ? <TriangleAlert className="size-7" /> : scheme === 'warning' ? <CircleAlert className="size-7" /> : scheme === 'info' ? <Info className="size-7" /> : <CircleCheck className="size-7" />;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100, zIndex: 1002 - i }}
            animate={{ opacity: 1, scale: 1 - i * .1, y: 0 - i * 30, zIndex: 1002 - i }}
            exit={{ opacity: 0, scale: 0.5, y: -100, zIndex: 1002 - i }}
            className={`absolute top-0 left-0 w-full h-fit rounded-full px-5 py-3 border shadow-md flex flex-wrap justify-between items-center ${schemeClasses}`}>
            <div className="flex flex-row gap-x-3 items-center">
                {icon}
                <span className="text-base md:text-lg line-clamp-1 text-ellipsis">{text}</span>
            </div>
            <button onClick={() => removeToast(toastId)} type="button" className="p-1 mr-10 transition-all duration-300 opacity-50 hover:opacity-100">
                <X className="size-5" />
            </button>
        </motion.div>
    );
}

export default Toast;