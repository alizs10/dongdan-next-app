import useStore from "@/store/store";
import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import moment from 'jalali-moment';

type Alert = {
    name: string;
    status: boolean;
    message: string;
}

export default function Alerts() {
    const { transactions } = useStore();

    const alertsInit: Alert[] = [
        {
            name: 'noIncomeThisMonth',
            status: false,
            message: 'این ماه درآمدی ثبت نشده است'
        },
        {
            name: 'lowBudgetThisMonth',
            status: false,
            message: '۸۰٪ بودجه این ماه مصرف شده است'
        },
        {
            name: 'lowBudgetThisMonthBalance',
            status: false,
            message: 'بودجه این ماه کمتر از ۲۰٪ درآمد است'
        },
        {
            name: 'lowBudgetAllTime',
            status: false,
            message: 'بودجه کل کمتر از ۲۰٪ درآمد است'
        },
        {
            name: 'minusBudgetThisMonth',
            status: false,
            message: 'کسری بودجه این ماه: ۰ تومان'
        },
        {
            name: 'minusBudgetAllTime',
            status: false,
            message: 'کسری بودجه کل: ۰ تومان'
        },
        {
            name: 'insufficientBudgetForUpcoming',
            status: false,
            message: 'بودجه برای صورتحساب‌های آتی کافی نیست'
        }
    ];

    const [alertsList, setAlertsList] = useState<Alert[]>(alertsInit);

    const { currentMonthBudget, allTimeBudget, upcomingExpensesTotal } = useMemo(() => {
        // Current Persian month
        const now = moment().locale('fa');
        const startOfMonth = now.clone().startOf('jMonth');
        const endOfMonth = now.clone().endOf('jMonth');
        const today = moment().locale('fa').startOf('day');

        // Filter transactions for current month
        const currentMonthTransactions = transactions.filter(transaction => {
            const transactionDate = moment(transaction.date, 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ').locale('fa');
            return transactionDate.isSameOrAfter(startOfMonth) && transactionDate.isSameOrBefore(endOfMonth);
        });

        // Calculate current month income and expenses
        const currentMonthIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentMonthExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate all-time income and expenses
        const allTimeIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const allTimeExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate upcoming expenses (same logic as UpcomingExpenses)
        const recurringExpenses = transactions.filter(transaction =>
            transaction.type === 'expense' &&
            transaction.is_recurring &&
            transaction.frequency
        );

        const expensesWithNextDate = recurringExpenses.map(expense => {
            let lastDate = moment(expense.date, 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ').locale('fa');
            let nextDate = lastDate.clone();

            switch (expense.frequency) {
                case 'daily':
                    nextDate.add(1, 'day');
                    break;
                case 'weekly':
                    nextDate.add(7, 'days');
                    break;
                case 'monthly':
                    nextDate.add(1, 'jMonth');
                    break;
                case 'yearly':
                    nextDate.add(1, 'jYear');
                    break;
                default:
                    nextDate = lastDate;
            }

            while (nextDate.isBefore(today)) {
                switch (expense.frequency) {
                    case 'daily':
                        nextDate.add(1, 'day');
                        break;
                    case 'weekly':
                        nextDate.add(7, 'days');
                        break;
                    case 'monthly':
                        nextDate.add(1, 'jMonth');
                        break;
                    case 'yearly':
                        nextDate.add(1, 'jYear');
                        break;
                }
            }

            return {
                ...expense,
                nextDate
            };
        });

        const upcomingExpenses = expensesWithNextDate
            .sort((a, b) => a.nextDate.valueOf() - b.nextDate.valueOf())
            .slice(0, 5);

        const upcomingExpensesTotal = upcomingExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        return {
            currentMonthBudget: {
                income: currentMonthIncome,
                expenses: currentMonthExpenses,
                balance: currentMonthIncome - currentMonthExpenses
            },
            allTimeBudget: {
                income: allTimeIncome,
                expenses: allTimeExpenses,
                balance: allTimeIncome - allTimeExpenses
            },
            upcomingExpensesTotal
        };
    }, [transactions]);

    useEffect(() => {
        // If no transactions, set all alerts to false
        if (transactions.length === 0) {
            setAlertsList(alertsInit.map(alert => ({ ...alert, status: false })));
            return;
        }

        const updatedAlerts = alertsList.map(alert => {
            switch (alert.name) {
                case 'noIncomeThisMonth':
                    return {
                        ...alert,
                        status: currentMonthBudget.income === 0
                    };
                case 'lowBudgetThisMonth':
                    return {
                        ...alert,
                        status: currentMonthBudget.income > 0 &&
                            currentMonthBudget.expenses / currentMonthBudget.income >= 0.8
                    };
                case 'lowBudgetThisMonthBalance':
                    return {
                        ...alert,
                        status: currentMonthBudget.income > 0 &&
                            currentMonthBudget.balance < currentMonthBudget.income * 0.2
                    };
                case 'lowBudgetAllTime':
                    return {
                        ...alert,
                        status: allTimeBudget.income > 0 &&
                            allTimeBudget.balance < allTimeBudget.income * 0.2
                    };
                case 'minusBudgetThisMonth':
                    return {
                        ...alert,
                        status: currentMonthBudget.balance < 0,
                        message: `کسری بودجه این ماه: ${Math.abs(currentMonthBudget.balance).toLocaleString('fa-IR')} تومان`
                    };
                case 'minusBudgetAllTime':
                    return {
                        ...alert,
                        status: allTimeBudget.balance < 0,
                        message: `کسری بودجه کل: ${Math.abs(allTimeBudget.balance).toLocaleString('fa-IR')} تومان`
                    };
                case 'insufficientBudgetForUpcoming':
                    return {
                        ...alert,
                        status: allTimeBudget.balance < upcomingExpensesTotal
                    };
                default:
                    return alert;
            }
        });

        setAlertsList(updatedAlerts);
    }, [currentMonthBudget, allTimeBudget, upcomingExpensesTotal]);

    return (
        <div className="border-t app_border_color py-3">
            <h3 className="text-lg font-semibold primary_text_color px-4 mb-4 flex items-center gap-x-2">
                <AlertTriangle className="size-5" />
                هشدارها
            </h3>
            <ul className="space-y-2">
                {alertsList.filter(alert => alert.status).length > 0 ? (
                    alertsList.filter(alert => alert.status).map((alert, index) => (
                        <li key={index} className="px-4 text-sm text-gray-700 dark:text-gray-300">
                            <AlertTriangle className="float-right mt-0.5 ml-2 size-4 text-yellow-500" />
                            <span>{alert.message}</span>
                        </li>
                    ))
                ) : (
                    <li className="flex items-center gap-2 px-4 text-sm text-gray-700 dark:text-gray-300">
                        <span>هیچ هشداری وجود ندارد</span>
                    </li>
                )}
            </ul>
        </div>
    );
}