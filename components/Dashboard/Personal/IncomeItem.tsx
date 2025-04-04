'use client'

import { Transaction } from "@/types/personal/transaction-types";
import moment from "jalali-moment";

const IncomeItem = ({ transaction }: { transaction: Transaction }) => {
    const { date, title, amount, description } = transaction; // Destructure transaction properties
    const persianDate = moment(date).locale('fa').format('jYYYY/jMM/jDD'); // Convert to Persian date

    return (
        <div className="p-6 border-b app_border_color last:border-b-0">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold app_text_color mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{persianDate}</p>
                    {/* <div className="flex gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="text-sm px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                            >
                                {tag}
                            </span>
                        ))}
                    </div> */}
                </div>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {amount}
                </span>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    )
}

export default IncomeItem
