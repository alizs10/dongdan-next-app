'use client'

import { useMemo } from 'react';
import useStore from '@/store/store';
import { TomanPriceFormatter } from '@/helpers/helpers';
import { CalendarDays } from 'lucide-react';
import moment from 'jalali-moment';
import { Transaction } from '@/types/personal/transaction-types';
import Tooltip from '@/components/Common/Tooltip';

const ThisMonthStats = () => {
    const { transactions } = useStore();

    const { balance, totalExpenses, totalIncome, biggestExpense, biggestIncome } = useMemo(() => {
        // Current Persian month
        const now = moment().locale('fa');
        const startOfMonth = now.clone().startOf('jMonth');
        const endOfMonth = now.clone().endOf('jMonth');

        // Filter transactions for current month
        const currentMonthTransactions = transactions.filter(transaction => {
            const transactionDate = moment(transaction.date, 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ').locale('fa');
            return transactionDate.isSameOrAfter(startOfMonth) && transactionDate.isSameOrBefore(endOfMonth);
        });

        // Calculate total income and expenses
        const totalIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Find biggest expense and income
        const biggestExpense = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((max: Transaction | null, t: Transaction) => (!max || t.amount > max.amount ? t : max), null);

        const biggestIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((max: Transaction | null, t: Transaction) => (!max || t.amount > max.amount ? t : max), null);

        return {
            balance: totalIncome - totalExpenses,
            totalIncome,
            totalExpenses,
            biggestExpense,
            biggestIncome
        };
    }, [transactions]);

    return (
        <div className="w-full border-t app_border_color py-6 px-4 app_bg_color rounded-lg">
            <div className="flex flex-row items-center mb-3 gap-x-2 primary_text_color">
                <CalendarDays className="size-5" />
                <h2 className="text-base font-semibold">ماه جاری در یک نگاه</h2>
            </div>

            <div className="flex flex-col gap-y-2">
                <div className={`flex justify-between items-center ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-nowrap">بودجه</span>
                    <span dir='ltr' className={`text-base font-semibold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {TomanPriceFormatter(balance ? balance.toString() : '0')}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-nowrap">مجموع درآمد</span>
                    <span dir='ltr' className="text-base font-semibold primary_text_color">
                        {TomanPriceFormatter(totalIncome ? totalIncome.toString() : '0')}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-nowrap">مجموع هزینه ها</span>
                    <span dir='ltr' className="text-base font-semibold primary_text_color">
                        {TomanPriceFormatter(totalExpenses ? totalExpenses.toString() : '0')}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-nowrap">بیشترین درآمد</span>
                    <span className="text-base font-semibold primary_text_color">
                        {biggestIncome ? `${biggestIncome.title}: ${TomanPriceFormatter(biggestIncome.amount.toString())}` : '–'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-nowrap">بیشترین هزینه</span>
                    <div className="w-fit">
                        <Tooltip
                            position='right'
                            text={biggestExpense ? biggestExpense.title : '–'}
                        >
                            <span dir='ltr' className="text-base font-semibold primary_text_color">
                                {biggestExpense ? `${TomanPriceFormatter(biggestExpense.amount.toString())}` : '–'}
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThisMonthStats;