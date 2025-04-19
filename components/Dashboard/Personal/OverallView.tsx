"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";
import { estedadFD } from "next-persian-fonts/estedad";
import IncomeExpenseChart from "./IncomeExpenseChart";
import BudgetGaugeChart from "./BudgetGaugeChart";
import CategoryPieChart from "./CategoryPieChart";
import useStore from "@/store/store";
import moment from "jalali-moment";

// Define interfaces for data structures
interface MonthlyData {
    month: string;
    income: number;
    expense: number;
}

interface SixMonthsData {
    categories: string[];
    incomeData: number[];
    expenseData: number[];
}

const OverallView = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const { transactions, budget } = useStore();
    const [fontLoaded, setFontLoaded] = useState(false);

    // Calculate total income and expense
    const totalIncome = useMemo(() => {
        return transactions
            .filter(transaction => transaction.type === "income")
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    }, [transactions]);

    // Calculate last six months data for IncomeExpenseChart
    const sixMonthsData = useMemo(() => {
        // Get current Jalali date
        const now = moment().locale("fa");
        const monthNames: string[] = [];
        const monthlyData: MonthlyData[] = [];

        // Loop through the last 6 months using Jalali calendar
        for (let i = 5; i >= 0; i--) {
            const jalaliDate = moment().locale("fa").subtract(i, 'months');
            const monthName = jalaliDate.format("MMMM YYYY");
            monthNames.push(monthName);

            // Initialize data
            monthlyData.push({
                month: monthName,
                income: 0,
                expense: 0
            });
        }

        // Sum up transactions by month
        transactions.forEach(transaction => {
            const transactionDate = moment(transaction.date).locale("fa");
            const sixMonthsAgo = moment().locale("fa").subtract(5, 'months').startOf('month');

            // Skip transactions older than six months
            if (transactionDate.isBefore(sixMonthsAgo)) return;

            // Find the month index
            const monthName = transactionDate.format("MMMM YYYY");
            const monthIndex = monthNames.indexOf(monthName);

            if (monthIndex !== -1) {
                if (transaction.type === "income") {
                    monthlyData[monthIndex].income += transaction.amount;
                } else {
                    monthlyData[monthIndex].expense += transaction.amount;
                }
            }
        });

        return {
            categories: monthNames,
            incomeData: monthlyData.map(d => d.income),
            expenseData: monthlyData.map(d => d.expense)
        };
    }, [transactions]);

    // Calculate category spending data for CategoryPieChart
    const categoryData = useMemo(() => {
        const data: Record<string, number> = {};

        // Only include expense transactions
        const expenseTransactions = transactions.filter(t => t.type === "expense");

        // Get category totals
        expenseTransactions.forEach(transaction => {
            if (transaction.categories) {
                transaction.categories.forEach(category => {
                    const categoryName = category.name;

                    // If multiple categories, divide amount equally among them
                    const amount = transaction.amount / (transaction.categories?.length || 1);

                    if (data[categoryName]) {
                        data[categoryName] += amount;
                    } else {
                        data[categoryName] = amount;
                    }
                });
            } else {
                // Handle uncategorized transactions
                if (data["دیگر"]) {
                    data["دیگر"] += transaction.amount;
                } else {
                    data["دیگر"] = transaction.amount;
                }
            }
        });

        return data;
    }, [transactions]);

    // Calculate total spent for BudgetGaugeChart
    const totalSpent = useMemo(() => {
        // Sum up expense transactions from the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return transactions
            .filter(t => t.type === "expense" && new Date(t.date) >= startOfMonth)
            .reduce((total, transaction) => total + transaction.amount, 0);
    }, [transactions]);

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
                <BudgetGaugeChart
                    isDarkMode={isDarkMode}
                    fontLoaded={fontLoaded}
                    totalBudget={totalIncome}
                    totalSpent={totalSpent}
                />
            </div>
            <div className="col-span-1">
                <h2
                    className="text-lg font-semibold text-gray-700 dark:text-white mb-4 text-right"
                    style={{ fontFamily: estedadFD.style.fontFamily }}
                >
                    هزینه‌ها بر اساس دسته‌بندی
                </h2>
                <CategoryPieChart
                    isDarkMode={isDarkMode}
                    fontLoaded={fontLoaded}
                    categoryData={categoryData}
                />
            </div>
            <div className="col-span-2">
                <h2
                    className="text-lg font-semibold text-gray-700 dark:text-white mb-4 text-right"
                    style={{ fontFamily: estedadFD.style.fontFamily }}
                >
                    درآمد و هزینه‌های ۶ ماه گذشته
                </h2>
                <IncomeExpenseChart
                    isDarkMode={isDarkMode}
                    fontLoaded={fontLoaded}
                    categories={sixMonthsData.categories}
                    incomeData={sixMonthsData.incomeData}
                    expenseData={sixMonthsData.expenseData}
                />
            </div>
        </div>
    );
};

export default OverallView;