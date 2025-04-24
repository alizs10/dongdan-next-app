"use client";

import ReactApexChart from "react-apexcharts";
import { estedadFD } from "next-persian-fonts/estedad";
import { useMemo, useState } from "react";
import { Transaction } from "@/types/personal/transaction-types";
import moment from "jalali-moment";

interface CategoryPieChartProps {
    isDarkMode: boolean;
    fontLoaded: boolean;
    transactions: Transaction[];
}

const CategoryPieChart = ({ isDarkMode, fontLoaded, transactions }: CategoryPieChartProps) => {
    const [filterType, setFilterType] = useState<'all' | 'currentMonth'>('all');

    // Calculate category data based on filter
    const categoryData = useMemo(() => {
        const data: Record<string, number> = {};

        // Filter transactions based on selected filter
        const filteredTransactions = filterType === 'currentMonth'
            ? transactions.filter(t => {
                const now = moment().locale('fa');
                const firstDayCurrentMonth = now.clone().startOf('jMonth').format('jYYYY/jMM/jDD');
                const lastDayCurrentMonth = now.clone().endOf('jMonth').format('jYYYY/jMM/jDD');
                const transactionDate = moment(t.date, 'YYYY-MM-DD').locale('fa').format('jYYYY/jMM/jDD');
                return transactionDate >= firstDayCurrentMonth && transactionDate <= lastDayCurrentMonth;
            })
            : transactions;

        // Only include expense transactions
        const expenseTransactions = filteredTransactions.filter(t => t.type === "expense");

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
    }, [transactions, filterType]);

    const options = {
        chart: {
            type: "pie" as const,
            height: 300,
            toolbar: { show: false },
            background: "transparent",
        },
        labels: Object.keys(categoryData),
        colors: ["#EF4444", "#FBBF24", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280"], // Multiple colors to support more categories
        dataLabels: {
            style: { fontFamily: estedadFD.style.fontFamily },
        },
        legend: {
            position: "bottom" as const,
            horizontalAlign: "center" as const,
            fontFamily: estedadFD.style.fontFamily,
            labels: { colors: isDarkMode ? "#FFFFFF" : "rgb(55, 65, 81)" },
        },
        tooltip: {
            enabled: true,
            dir: 'rtl',
            style: {
                fontFamily: estedadFD.style.fontFamily,
                textAlign: 'right',
            },
            theme: isDarkMode ? "dark" : "light",
            custom: ({ series, seriesIndex, w }: any) => {
                const value = series[seriesIndex];
                const label = w.globals.labels[seriesIndex];
                return `
                    <div dir="rtl" style="font-family: ${estedadFD.style.fontFamily}; padding: 8px; text-align: right; background: ${isDarkMode ? '#333' : '#fff'}; border-radius: 4px; color: ${isDarkMode ? '#fff' : '#333'};">
                        ${label}: ${value.toLocaleString('fa-IR')} تومان
                    </div>
                `;
            },
        },
    };

    const series = Object.values(categoryData);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2
                    className="text-lg font-semibold text-gray-700 dark:text-white text-right"
                    style={{ fontFamily: estedadFD.style.fontFamily }}
                >
                    هزینه‌ها بر اساس دسته‌بندی
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1 rounded-full text-sm ${filterType === 'all'
                            ? 'bg-indigo-800 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        همه
                    </button>
                    <button
                        onClick={() => setFilterType('currentMonth')}
                        className={`px-3 py-1 rounded-full text-sm ${filterType === 'currentMonth'
                            ? 'bg-indigo-800 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        ماه جاری
                    </button>
                </div>
            </div>
            {fontLoaded ? (
                <ReactApexChart options={options} series={series} type="pie" height={300} />
            ) : (
                <div
                    className="h-[300px] flex items-center justify-center text-gray-500"
                    style={{ fontFamily: estedadFD.style.fontFamily }}
                >
                    در حال بارگذاری...
                </div>
            )}
        </div>
    );
};

export default CategoryPieChart;