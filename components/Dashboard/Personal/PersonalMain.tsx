"use client";

import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LeftSidebar from "@/components/Dashboard/Personal/LeftSidebar";
import Transactions from "@/components/Dashboard/Personal/Transactions";
import RightSidebar from "@/components/Dashboard/Personal/RightSidebar";
import OverallView from "@/components/Dashboard/Personal/OverallView";

export type Transaction = {
    type: string;
    title: string;
    date: string;
    amount: string;
    description: string;
    tags: string[];
}

export default function PersonalMain() {
    const [activeTab, setActiveTab] = useState<"overview" | "transactions">("transactions");

    const transactions: Transaction[] = [
        {
            type: "income",
            title: "حقوق ماهانه",
            date: "2025-03-01T00:00:00Z", // ۱۱ اسفند ۱۴۰۳
            amount: "۴۵,۰۰۰,۰۰۰+",
            description: "حقوق ماه اسفند شرکت فناوری",
            tags: ["حقوق", "ثابت", "ماهانه"],
        },
        {
            type: "income",
            title: "پروژه فریلنسری",
            date: "2025-02-15T00:00:00Z", // ۲۶ بهمن ۱۴۰۳
            amount: "۱۲,۷۵۰,۰۰۰+",
            description: "طراحی اپلیکیشن موبایل برای مشتری خارجی",
            tags: ["فریلنس", "پروژه", "دلار"],
        },
        {
            type: "income",
            title: "فروش محصول دیجیتال",
            date: "2025-01-20T00:00:00Z", // ۱ بهمن ۱۴۰۳
            amount: "۳,۲۰۰,۰۰۰+",
            description: "فروش دوره آموزشی آنلاین",
            tags: ["کسب‌وکار", "آنلاین"],
        },
        {
            type: "expense",
            title: "اجاره خانه",
            date: "2025-03-01T00:00:00Z", // ۱۱ اسفند ۱۴۰۳
            amount: "۱۵,۰۰۰,۰۰۰-",
            description: "اجاره ماهانه آپارتمان",
            tags: ["مسکن", "ثابت", "ماهانه"],
        },
        {
            type: "expense",
            title: "خرید لپ‌تاپ",
            date: "2024-12-25T00:00:00Z", // ۵ دی ۱۴۰۳
            amount: "۳۸,۵۰۰,۰۰۰-",
            description: "لپ‌تاپ جدید برای کار",
            tags: ["تکنولوژی", "یک‌بار"],
        },
        {
            type: "expense",
            title: "هزینه اینترنت",
            date: "2025-02-28T00:00:00Z", // ۹ اسفند ۱۴۰۳
            amount: "۴۰۰,۰۰۰-",
            description: "بسته اینترنت ۶۰ گیگ",
            tags: ["اینترنت", "ماهانه"],
        },
        {
            type: "expense",
            title: "قبض آب",
            date: "2025-02-10T00:00:00Z", // ۲۱ بهمن ۱۴۰۳
            amount: "۲۵۰,۰۰۰-",
            description: "قبض دو ماهه زمستان",
            tags: ["قبوض", "فصلی"],
        },
        {
            type: "expense",
            title: "رستوران",
            date: "2025-03-05T00:00:00Z", // ۱۵ اسفند ۱۴۰۳
            amount: "۱,۸۰۰,۰۰۰-",
            description: "شام با دوستان",
            tags: ["تفریح", "غذا"],
        },
        {
            type: "income",
            title: "پاداش پروژه",
            date: "2025-01-30T00:00:00Z", // ۱۰ بهمن ۱۴۰۳
            amount: "۷,۵۰۰,۰۰۰+",
            description: "پاداش پایان پروژه شرکت",
            tags: ["حقوق", "پاداش"],
        },
        {
            type: "expense",
            title: "خرید لباس",
            date: "2025-01-15T00:00:00Z", // ۲۵ دی ۱۴۰۳
            amount: "۲,۳۰۰,۰۰۰-",
            description: "خرید لباس زمستانی",
            tags: ["پوشاک", "فصلی"],
        },
    ];


    return (
        <div className="flex min-h-screen pb-10">
            <RightSidebar />

            {/* Main Content */}
            <div className="flex-1 border-x app_border_color">
                <div className="flex items-center gap-4 border-b app_border_color p-4">
                    <Link href="/dashboard" className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </Link>
                    <h1 className="text-2xl font-bold primary_text_color">مدیریت هزینه های شخصی</h1>
                </div>
                <div className="flex border-b app_border_color flex-row mb-6 w-full">
                    <button
                        className={`flex-1 px-6 py-4 transition-colors ${activeTab === "transactions"
                            ? "primary_bg_color text-white"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveTab("transactions")}
                    >
                        تراکنش ها
                    </button>
                    <button
                        className={`flex-1 px-6 py-4 transition-colors ${activeTab === "overview"
                            ? "primary_bg_color text-white"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveTab("overview")}
                    >
                        نمای کلی
                    </button>

                </div>
                <div className="space-y-6">
                    {activeTab === "overview" ? <OverallView /> : <Transactions transactions={transactions} />}
                </div>
            </div>

            <LeftSidebar />
        </div>
    );
}