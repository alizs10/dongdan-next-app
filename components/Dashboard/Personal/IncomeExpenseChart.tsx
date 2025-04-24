"use client";

import ReactApexChart from "react-apexcharts";
import { estedadFD } from "next-persian-fonts/estedad";
import { useMemo } from "react";
import { Transaction } from "@/types/personal/transaction-types";
import moment from "jalali-moment";

interface IncomeExpenseChartProps {
    isDarkMode: boolean;
    fontLoaded: boolean;
    transactions: Transaction[];
}

const IncomeExpenseChart = ({ isDarkMode, fontLoaded, transactions }: IncomeExpenseChartProps) => {
    console.log("isDarkMode: ", isDarkMode);
    console.log("transactions: ", transactions); // Debug transactions

    // Calculate last 6 months data
    const { categories, incomeData, expenseData } = useMemo(() => {
        const now = moment();
        const monthNames: string[] = [];
        const monthlyData: { [key: string]: { income: number; expense: number } } = {};

        // Get last 6 months using Persian calendar
        for (let i = 5; i >= 0; i--) {
            const month = moment().subtract(i, 'jMonth');
            const monthName = month.locale('fa').format("jMMMM");
            monthNames.push(monthName);
            monthlyData[monthName] = { income: 0, expense: 0 };
        }

        // Sum up transactions by month
        transactions.forEach(transaction => {
            const transactionDate = moment(transaction.date);
            const monthName = transactionDate.locale('fa').format("jMMMM");

            // Only include transactions from the last 6 months
            if (monthlyData[monthName]) {
                if (transaction.type === "income") {
                    monthlyData[monthName].income += transaction.amount;
                } else if (transaction.type === "expense") {
                    monthlyData[monthName].expense += transaction.amount;
                }
            }
        });

        return {
            categories: monthNames,
            incomeData: monthNames.map(month => monthlyData[month].income),
            expenseData: monthNames.map(month => monthlyData[month].expense),
        };
    }, [transactions]);

    console.log("categories: ", categories); // Debug categories
    console.log("incomeData: ", incomeData); // Debug incomeData
    console.log("expenseData: ", expenseData); // Debug expenseData

    const options = useMemo(() => ({
        chart: {
            type: "bar" as const,
            height: 300,
            stacked: false,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 8, // Add border radius for rounding
                borderRadiusApplication: "end" as const, // Round only the top
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [2, 2],
            colors: ["transparent"],
        },
        xaxis: {
            categories,
            labels: {
                style: {
                    fontFamily: estedadFD.style.fontFamily,
                    colors: Array(categories.length).fill(isDarkMode ? "#E5E7EB" : "rgb(55, 65, 81)"),
                },
            },
        },
        yaxis: {
            title: {
                text: "مبلغ (تومان)",
                style: {
                    fontFamily: estedadFD.style.fontFamily,
                    fontWeight: 'normal',
                    color: isDarkMode ? "#E5E7EB" : "rgb(55, 65, 81)",
                },
            },
            labels: {
                style: {
                    fontFamily: estedadFD.style.fontFamily,
                    colors: [isDarkMode ? "#E5E7EB" : "rgb(55, 65, 81)"],
                },
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: { formatter: (val: number) => `${val.toLocaleString()} تومان` },
            style: { fontFamily: estedadFD.style.fontFamily },
            theme: isDarkMode ? "dark" : "light",
        },
        legend: {
            position: "top" as const,
            horizontalAlign: "right" as const,
            fontFamily: estedadFD.style.fontFamily,
            labels: {
                colors: [isDarkMode ? "#E5E7EB" : "rgb(55, 65, 81)"],
            },
        },
    }), [isDarkMode, categories]);

    const series = useMemo(() => [
        {
            name: "درآمد",
            data: incomeData,
            color: "#10B981",
        },
        {
            name: "هزینه",
            data: expenseData,
            color: "#EF4444",
        },
    ], [incomeData, expenseData]);

    return (
        <div>
            <h2
                className="text-lg font-semibold text-gray-700 dark:text-white text-right mb-4"
                style={{ fontFamily: estedadFD.style.fontFamily }}
            >
                درآمد و هزینه ۶ ماه گذشته
            </h2>
            {fontLoaded ? (
                <ReactApexChart options={options} series={series} type="bar" height={300} />
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

export default IncomeExpenseChart;