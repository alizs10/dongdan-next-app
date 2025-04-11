import useStore from "@/store/store";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

export default function Alerts() {
    const { transactions } = useStore();

    const lastMonthBudget = useMemo(() => {
        // Get current date
        const now = new Date();
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Filter transactions for last month
        const lastMonthTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= firstDayLastMonth && transactionDate <= lastDayLastMonth;
        });

        // Calculate total income and expenses
        const totalIncome = lastMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = lastMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income: totalIncome,
            expenses: totalExpenses,
            balance: totalIncome - totalExpenses
        };
    }, [transactions]);

    const getBudgetAlert = () => {
        if (lastMonthBudget.balance < 0) {
            return {
                message: `بودجه منفی: ${Math.abs(lastMonthBudget.balance).toLocaleString()} تومان`,
                type: 'negative'
            };
        }

        const expenseRatio = lastMonthBudget.expenses / lastMonthBudget.income;
        if (expenseRatio >= 0.8) {
            return {
                message: `۸۰٪ بودجه مصرف شده`,
                type: 'warning'
            };
        }

        return null;
    };

    const alert = getBudgetAlert();

    return (
        <div className="border-t app_border_color py-3">
            <h3 className="text-lg font-semibold primary_text_color px-4 mb-4 flex items-center gap-x-2">
                <AlertTriangle className="size-5" />
                هشدار ها
            </h3>
            <ul className="space-y-2">
                {alert ? (
                    <li className="flex items-center gap-2 px-4 text-sm text-gray-700 dark:text-gray-300">
                        <AlertTriangle className={`size-4 ${alert.type === 'negative' ? 'text-red-500' : 'text-yellow-500'}`} />
                        <span>{alert.message}</span>
                    </li>
                ) : (
                    <li className="flex items-center gap-2 px-4 text-sm text-gray-700 dark:text-gray-300">
                        <span>هیچ هشداری وجود ندارد</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
