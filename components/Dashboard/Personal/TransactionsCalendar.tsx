import useStore from "@/store/store";
import { Transaction } from "@/types/personal/transaction-types";
import moment from "jalali-moment";
import { Calendar } from "lucide-react";
import { useMemo, useState } from "react";

// Persian month names
const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

// Function to get Persian month and year from Gregorian date
function getPersianMonth(gregorianDate: Date): string {
    const jalaliDate = moment(gregorianDate).locale("fa");
    const persianMonthIndex = jalaliDate.jMonth(); // 0-11 (Farvardin is 0)
    const persianYear = jalaliDate.jYear(); // Persian year
    return `${persianMonths[persianMonthIndex]} ${persianYear}`;
}

export default function TransactionsCalendar() {
    const { transactions, setActiveFilters } = useStore();
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    // Group transactions by Persian month and year - memoized for performance
    const groupedTransactions = useMemo(() => {
        const groupedByMonth: { [key: string]: Transaction[] } = {};
        const totalCount = transactions.length;

        transactions.forEach((transaction) => {
            const persianMonth = getPersianMonth(transaction.date);
            if (!groupedByMonth[persianMonth]) {
                groupedByMonth[persianMonth] = [];
            }
            groupedByMonth[persianMonth].push(transaction);
        });

        // Sort months chronologically (newest first)
        const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
            const yearA = parseInt(a.split(' ')[1]);
            const yearB = parseInt(b.split(' ')[1]);
            if (yearA !== yearB) return yearB - yearA;

            const monthA = persianMonths.indexOf(a.split(' ')[0]);
            const monthB = persianMonths.indexOf(b.split(' ')[0]);
            return monthB - monthA;
        });

        return {
            byMonth: groupedByMonth,
            sortedMonths,
            totalCount
        };
    }, [transactions]);

    // Handle filter by month
    const handleMonthClick = (month: string | null) => {
        setSelectedMonth(month);

        if (month === null) {
            // Clear date filters when "All" is selected
            setActiveFilters({ type: 'all' });
            return;
        }

        // Create date range for the selected month
        const [monthName, yearStr] = month.split(' ');
        const monthIndex = persianMonths.indexOf(monthName);
        const year = parseInt(yearStr);

        // Convert Persian date to Gregorian for filtering
        const startDate = moment.from(`${year}/${monthIndex + 1}/1`, 'fa', 'YYYY/MM/D').toDate();
        const endMonthDay = monthIndex === 11 ? 29 : 30; // Handle Esfand which can be 29 days
        const endDate = moment.from(`${year}/${monthIndex + 1}/${endMonthDay}`, 'fa', 'YYYY/MM/D').toDate();

        // Set date filter in store
        setActiveFilters({
            minDate: startDate,
            maxDate: endDate,
            type: 'all'
        });
    };

    return (
        <div className="py-6 border-t app_border_color rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold primary_text_color px-6 mb-4">
                <Calendar className="size-5" />
                <h3>تقویم</h3>
            </div>
            <ul className="space-y-2 pb-4">
                <li>
                    <button
                        className={`w-full text-sm text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center ${selectedMonth === null ? 'bg-indigo-900/20 dark:bg-indigo-600/20 text-indigo-900 dark:text-indigo-600' : ''}`}
                        onClick={() => handleMonthClick(null)}
                    >
                        همه
                        <span className={`text-sm ${selectedMonth === null ? 'text-indigo-900 dark:text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>({groupedTransactions.totalCount})</span>
                    </button>
                </li>
                {groupedTransactions.sortedMonths.map((month) => (
                    <li key={month}>
                        <button
                            className={`w-full text-sm text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center ${selectedMonth === month ? 'bg-indigo-900/20 dark:bg-indigo-600/20 text-indigo-900 dark:text-indigo-600' : ''}`}
                            onClick={() => handleMonthClick(month)}
                        >
                            {month}
                            <span className={`text-sm ${selectedMonth === month ? 'text-indigo-900 dark:text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>({groupedTransactions.byMonth[month].length})</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
