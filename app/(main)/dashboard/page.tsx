import { BarChart3, PieChart } from "lucide-react";
import Link from "next/link";


function DashboardPage() {


    return (
        <section className="min-h-screen flex-grow flex items-center justify-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
                {/* Expense Split Manager Card */}
                <Link href="/dashboard/events" className="block">
                    <div className="app_bg_color app_border_color border rounded-xl p-8 cursor-pointer flex flex-col items-center">
                        <PieChart className="size-24 mb-6 primary_text_color" strokeWidth={1.5} />
                        <h2 className="text-2xl font-semibold app_text_color mb-4">محاسبه گر دنگ</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">پیگیری و تقسیم هزینه‌ها با دوستان یا گروه‌ها</p>
                        <button className="w-full px-6 py-3 primary_bg_color text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors text-lg">
                            برو به محاسبه گر دنگ
                        </button>
                    </div>
                </Link>

                <Link href="/dashboard/personal" className="block">
                    <div className="app_bg_color app_border_color border rounded-xl p-8 cursor-pointer flex flex-col items-center">
                        <BarChart3 className="size-24 mb-6 primary_text_color" strokeWidth={1.5} />
                        <h2 className="text-2xl font-semibold app_text_color mb-4">مدیریت هزینه</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">مدیریت هزینه‌های شخصی و بودجه‌های خود</p>
                        <button className="w-full px-6 py-3 primary_bg_color text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors text-lg">
                            برو به مدیریت هزینه
                        </button>
                    </div>
                </Link>
            </div>
        </section>
    )

}

export default DashboardPage;