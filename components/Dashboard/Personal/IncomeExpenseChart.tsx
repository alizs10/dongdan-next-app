"use client";

import ReactApexChart from "react-apexcharts";
import { estedadFD } from "next-persian-fonts/estedad";

interface IncomeExpenseChartProps {
    isDarkMode: boolean;
    fontLoaded: boolean;
    categories: string[];
    incomeData: number[];
    expenseData: number[];
}

const IncomeExpenseChart = ({ isDarkMode, fontLoaded, categories, incomeData, expenseData }: IncomeExpenseChartProps) => {
    const options = {
        chart: {
            type: "bar" as const,
            height: 300,
            toolbar: { show: false },
            background: "transparent",
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "20%",
                borderRadius: 6,
                borderRadiusApplication: "around" as const,
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    fontSize: "12px",
                    fontFamily: estedadFD.style.fontFamily,
                    colors: Array(categories.length).fill(isDarkMode ? "#FFFFFF" : "rgb(55, 65, 81)"),
                },
            },
        },
        yaxis: {
            title: {
                text: "تومان",
                style: {
                    fontSize: "14px",
                    fontFamily: estedadFD.style.fontFamily,
                    fontWeight: "normal",
                    color: isDarkMode ? "#FFFFFF" : "rgb(55, 65, 81)",
                },
            },
            labels: {
                style: {
                    fontFamily: estedadFD.style.fontFamily,
                    colors: [isDarkMode ? "#FFFFFF" : "rgb(55, 65, 81)"],
                },
                formatter: (val: number) => `${(val / 1000000).toFixed(1)}M`,
            },
        },
        fill: { opacity: 1 },
        colors: ["#10B981", "#EF4444"], // green-500 and red-500
        tooltip: {
            y: { formatter: (val: number) => `${val.toLocaleString()} تومان` },
            style: { fontFamily: estedadFD.style.fontFamily },
            theme: isDarkMode ? "dark" : "light",
        },
        legend: {
            position: "top" as const,
            horizontalAlign: "right" as const,
            fontFamily: estedadFD.style.fontFamily,
            labels: { colors: isDarkMode ? "#FFFFFF" : "rgb(55, 65, 81)" },
        },
        grid: {
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            borderColor: isDarkMode ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)",
        },
    };

    const series = [
        { name: "درآمد", data: incomeData },
        { name: "هزینه", data: expenseData },
    ];

    return fontLoaded ? (
        <ReactApexChart options={options} series={series} type="bar" height={300} />
    ) : (
        <div
            className="h-[300px] flex items-center justify-center text-gray-500"
            style={{ fontFamily: estedadFD.style.fontFamily }}
        >
            در حال بارگذاری...
        </div>
    );
};

export default IncomeExpenseChart;