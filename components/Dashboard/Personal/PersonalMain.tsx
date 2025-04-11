"use client";

import { ArrowLeftRightIcon, MoveRight, ViewIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LeftSidebar from "@/components/Dashboard/Personal/LeftSidebar";
import Transactions from "@/components/Dashboard/Personal/Transactions";
import RightSidebar from "@/components/Dashboard/Personal/RightSidebar";
import OverallView from "@/components/Dashboard/Personal/OverallView";
import { Transaction } from "@/types/personal/transaction-types";
import { InitData, InitDataResponse } from "@/types/responses/personal/init";
import useStore from "@/store/store";


export default function PersonalMain({ data }: { data: InitData }) {
    const [activeTab, setActiveTab] = useState<"overview" | "transactions">("transactions");

    const { setInitData } = useStore()

    useEffect(() => {
        setInitData(data);
    }, [data, setInitData]);

    return (
        <div className="flex min-h-screen">
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
                        className={`flex-1 flex flex-row items-center gap-x-2 justify-center px-6 py-4 transition-colors ${activeTab === "transactions"
                            ? "primary_bg_color text-white"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveTab("transactions")}
                    >
                        <ArrowLeftRightIcon className="size-5" />
                        تراکنش ها
                    </button>
                    <button
                        className={`flex-1 flex flex-row items-center gap-x-2 justify-center px-6 py-4 transition-colors ${activeTab === "overview"
                            ? "primary_bg_color text-white"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveTab("overview")}
                    >
                        <ViewIcon className="size-5" />
                        نمای کلی
                    </button>

                </div>
                <div className="space-y-6">
                    {activeTab === "overview" ? <OverallView /> : <Transactions />}
                </div>
            </div>

            <LeftSidebar />
        </div>
    );
}