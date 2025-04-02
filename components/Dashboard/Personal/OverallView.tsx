"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { estedadFD } from "next-persian-fonts/estedad";
import IncomeExpenseChart from "./IncomeExpenseChart";
import BudgetGaugeChart from "./BudgetGaugeChart";
import CategoryPieChart from "./CategoryPieChart";

const OverallView = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

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
        <div className="p-6 grid grid-cols-2">

            <div className="col-span-1">
                <h2
                    className="text-lg font-semibold text-gray-700 dark:text-white mb-4 text-right"
                    style={{ fontFamily: estedadFD.style.fontFamily }}
                >
                    مصرف بودجه
                </h2>
                <BudgetGaugeChart isDarkMode={isDarkMode} fontLoaded={fontLoaded} />
            </div>
            <div className="col-span-1">
                <h2
                    className="text-lg font-semibold text-gray-700 dark:text-white mb-4 text-right"
                    style={{ fontFamily: estedadFD.style.fontFamily }}
                >
                    هزینه‌ها بر اساس دسته‌بندی
                </h2>
                <CategoryPieChart isDarkMode={isDarkMode} fontLoaded={fontLoaded} />
            </div>
            <div className="col-span-2">
                <h2
                    className="text-lg font-semibold text-gray-700 dark:text-white mb-4 text-right"
                    style={{ fontFamily: estedadFD.style.fontFamily }}
                >
                    درآمد و هزینه‌های ۶ ماه گذشته
                </h2>
                <IncomeExpenseChart isDarkMode={isDarkMode} fontLoaded={fontLoaded} />
            </div>
        </div>
    );
};

export default OverallView;