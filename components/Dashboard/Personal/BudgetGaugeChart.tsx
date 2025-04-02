"use client";

import ReactApexChart from "react-apexcharts";
import { estedadFD } from "next-persian-fonts/estedad";

interface BudgetGaugeChartProps {
    isDarkMode: boolean;
    fontLoaded: boolean;
}

const BudgetGaugeChart = ({ isDarkMode, fontLoaded }: BudgetGaugeChartProps) => {
    const totalBudget = 20000000; // Mock budget: 20M toman
    const totalSpent = 15550000; // Sum of expenses: 15.55M toman
    const spentPercentage = Math.round((totalSpent / totalBudget) * 100);

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
        fill: { colors: ["#10B981"] }, // green-500
        labels: ["مصرف بودجه"],
        tooltip: {
            enabled: true,
            style: { fontFamily: estedadFD.style.fontFamily },
            theme: isDarkMode ? "dark" : "light",
            y: { formatter: () => `${totalSpent.toLocaleString()} از ${totalBudget.toLocaleString()} تومان` },
        },
    };

    const series = [spentPercentage]; // 77.75% spent

    return fontLoaded ? (
        <ReactApexChart options={options} series={series} type="radialBar" height={300} />
    ) : (
        <div
            className="h-[300px] flex items-center justify-center text-gray-500"
            style={{ fontFamily: estedadFD.style.fontFamily }}
        >
            در حال بارگذاری...
        </div>
    );
};

export default BudgetGaugeChart;