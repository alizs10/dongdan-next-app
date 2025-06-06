import Button from "@/components/Common/Button";
import { Calendar, Plus, Tags } from "lucide-react";
import { useState } from "react";
import NewCategoryModal from "./Modals/NewCategoryModal";
import Categories from "./Categories";
import TransactionsCalendar from "./TransactionsCalendar";

export default function LeftSidebar() {


    return (
        <div className="w-72 scrollbar-thin max-h-[calc(100vh_-_5rem)] overflow-y-scroll app_bg_color h-full sticky top-20">
            <Categories />
            <TransactionsCalendar />
        </div>
    )
}
