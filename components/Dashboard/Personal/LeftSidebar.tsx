import { Calendar, Tags } from "lucide-react";

export default function LeftSidebar() {
    return (
        <div className="w-64 app_bg_color h-full sticky top-20">
            <div className="mb-6">
                <div className="flex items-center gap-2 text-lg font-semibold primary_text_color px-6 pt-6 mb-4">
                    <Tags className="size-5" />
                    <h3>برچسب‌ها</h3>
                </div>
                <ul className="space-y-2">
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            ماهانه
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۵)</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            حقوق
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۳)</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            فریلنس
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۲)</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            تفریح
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۱)</span>
                        </button>
                    </li>
                </ul>
            </div>
            <div>
                <div className="flex items-center gap-2 text-lg font-semibold primary_text_color px-6 pt-6 mb-4">
                    <Calendar className="size-5" />
                    <h3>تقویم</h3>
                </div>
                <ul className="space-y-2">
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            همه
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۱۰)</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            اسفند ۱۴۰۳
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۴)</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            بهمن ۱۴۰۳
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۳)</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            دی ۱۴۰۳
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۲)</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                            آذر ۱۴۰۳
                            <span className="text-sm text-gray-500 dark:text-gray-400">(۱)</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}
