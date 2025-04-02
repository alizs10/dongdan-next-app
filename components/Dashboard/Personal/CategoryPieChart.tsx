"use client";

import ReactApexChart from "react-apexcharts";
import { estedadFD } from "next-persian-fonts/estedad";

interface CategoryPieChartProps {
    isDarkMode: boolean;
    fontLoaded: boolean;
}

const CategoryPieChart = ({ isDarkMode, fontLoaded }: CategoryPieChartProps) => {
    const categoryData = {
        "مسکن": 7200000, // e.g., rent over 6 months
        "غذا": 3600000, // food
        "تفریح": 2550000, // entertainment
        "خدمات": 1250000, // services (e.g., internet)
        "دیگر": 950000, // other
    };

    const options = {
        chart: {
            type: "pie" as const,
            height: 300,
            toolbar: { show: false },
            background: "transparent",
        },
        labels: Object.keys(categoryData),
        colors: ["#EF4444", "#FBBF24", "#F59E0B", "#10B981", "#3B82F6"], // red-500, amber-400, amber-500, green-500, blue-500
        dataLabels: {
            style: { fontFamily: estedadFD.style.fontFamily },
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
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