"use client";

import ReactApexChart from "react-apexcharts";
import { estedadFD } from "next-persian-fonts/estedad";
import { useMemo, useState } from "react";
import { Transaction } from "@/types/personal/transaction-types";
import moment from "jalali-moment";

interface BudgetGaugeChartProps {
    isDarkMode: boolean;
    fontLoaded: boolean;
    transactions: Transaction[];
}

const BudgetGaugeChart = ({ isDarkMode, fontLoaded, transactions }: BudgetGaugeChartProps) => {
    const [filterType, setFilterType] = useState<'all' | 'currentMonth'>('all');

    // Calculate total income and spent based on filter
    const { totalBudget, totalSpent, spentPercentage } = useMemo(() => {
        const filteredTransactions = filterType === 'currentMonth'
            ? transactions.filter(t => {
                const now = moment().locale('fa');
                const firstDayCurrentMonth = now.clone().startOf('jMonth').format('jYYYY/jMM/jDD');
                const lastDayCurrentMonth = now.clone().endOf('jMonth').format('jYYYY/jMM/jDD');
                const transactionDate = moment(t.date, 'YYYY-MM-DD').locale('fa').format('jYYYY/jMM/jDD');
                return transactionDate >= firstDayCurrentMonth && transactionDate <= lastDayCurrentMonth;
            })
            : transactions;

        const totalBudget = filteredTransactions
            .filter(transaction => transaction.type === "income")
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        const totalSpent = filteredTransactions
            .filter(t => t.type === "expense")
            .reduce((total, transaction) => total + transaction.amount, 0);

        const spentPercentage = totalBudget > 0 ? Math.round((totalSpent / Math.abs(totalBudget)) * 100) : 100;

        return { totalBudget, totalSpent, spentPercentage };
    }, [transactions, filterType]);

    // Calculate dynamic color based on spentPercentage
    const dynamicColor = useMemo(() => {
        const green = { r: 16, g: 185, b: 129 }; // #10B981
        const red = { r: 239, g: 68, b: 68 }; // #EF4444
        const ratio = Math.min(Math.max(spentPercentage / 100, 0), 1); // Normalize between 0 and 1

        const r = Math.round(green.r + (red.r - green.r) * ratio);
        const g = Math.round(green.g + (red.g - green.g) * ratio);
        const b = Math.round(green.b + (red.b - green.b) * ratio);

        return `rgb(${r}, ${g}, ${b})`;
    }, [spentPercentage]);

    const options = {
        chart: {
            type: "radialBar" as const,
            height: 300,
            toolbar: { show: false },
            background: "transparent",
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: { size: "70%" },
                track: { background: isDarkMode ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" },
                dataLabels: {
                    show: true,
                    name: { show: true, fontSize: "16px", fontFamily: estedadFD.style.fontFamily, color: isDarkMode ? "#FFFFFF" : "rgb(55, 65, 81)" },
                    value: {
                        show: true,
                        fontSize: "24px",
                        fontFamily: estedadFD.style.fontFamily,
                        color: isDarkMode ? "#FFFFFF" : "rgb(55, 65, 81)",
                        formatter: (val: number) => `${val}%`,
                    },
                },
            },
        },
        fill: { colors: [dynamicColor] }, // Dynamic color based on spentPercentage
        labels: ["مصرف بودجه"],
        tooltip: {
            enabled: true,
            dir: 'rtl',
            style: {
                fontFamily: estedadFD.style.fontFamily,
                textAlign: 'right',
            },
            theme: isDarkMode ? "dark" : "light",
            custom: ({ series, seriesIndex, w }: any) => {
                const percentage = w.globals.series[seriesIndex];
                return `
                    <div dir="rtl" style="font-family: ${estedadFD.style.fontFamily}; padding: 8px; text-align: right; background: ${isDarkMode ? '#333' : '#fff'}; border-radius: 4px; color: ${isDarkMode ? '#fff' : '#333'};">
                        ${totalSpent.toLocaleString('fa-IR')} از ${totalBudget.toLocaleString('fa-IR')} تومان
                    </div>
                `;
            },
        },
    };

    const series = [Math.abs(spentPercentage)]; // Use absolute value for radialBar display

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2
                    className="text-lg font-semibold text-gray-700 dark:text-white text-right"
                    style={{ fontFamily: estedadFD.style.fontFamily }}
                >
                    مصرف بودجه
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
                <ReactApexChart options={options} series={series} type="radialBar" height={300} />
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

export default BudgetGaugeChart;