"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { estedadFD } from "next-persian-fonts/estedad";
import IncomeExpenseChart from "./IncomeExpenseChart";
import BudgetGaugeChart from "./BudgetGaugeChart";
import CategoryPieChart from "./CategoryPieChart";
import useStore from "@/store/store";

const OverallView = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const { transactions } = useStore();
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const loadFont = async () => {
            if (!document.fonts) {
                setFontLoaded(true);
                return;
            }
            try {
                await document.fonts.load(`1rem ${estedadFD.style.fontFamily}`);
                setFontLoaded(true);
            } catch (error) {
                console.error("Failed to load Estedad font:", error);
                setFontLoaded(true);
            }
        };
        loadFont();
    }, []);

    return (
        <div className="p-6 grid grid-cols-2 gap-2">
            <div className="col-span-1">
                <BudgetGaugeChart
                    isDarkMode={isDarkMode}
                    fontLoaded={fontLoaded}
                    transactions={transactions}
                />
            </div>
            <div className="col-span-1">
                <CategoryPieChart
                    isDarkMode={isDarkMode}
                    fontLoaded={fontLoaded}
                    transactions={transactions}
                />
            </div>
            <div className="col-span-2">
                <IncomeExpenseChart
                    isDarkMode={isDarkMode}
                    fontLoaded={fontLoaded}
                    transactions={transactions}
                />
            </div>
        </div>
    );
};

export default OverallView;