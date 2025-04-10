"use client";

import ReactApexChart from "react-apexcharts";
import { estedadFD } from "next-persian-fonts/estedad";

interface CategoryPieChartProps {
    isDarkMode: boolean;
    fontLoaded: boolean;
    categoryData: Record<string, number>;
}

const CategoryPieChart = ({ isDarkMode, fontLoaded, categoryData }: CategoryPieChartProps) => {
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
            y: { formatter: (val: number) => `${val.toLocaleString()} تومان` },
            style: { fontFamily: estedadFD.style.fontFamily },
            theme: isDarkMode ? "dark" : "light",
        },
    };

    const series = Object.values(categoryData);

    return fontLoaded ? (
        <ReactApexChart options={options} series={series} type="pie" height={300} />
    ) : (
        <div
            className="h-[300px] flex items-center justify-center text-gray-500"
            style={{ fontFamily: estedadFD.style.fontFamily }}
        >
            در حال بارگذاری...
        </div>
    );
};

export default CategoryPieChart;