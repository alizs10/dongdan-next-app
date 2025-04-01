'use client'

import moment from "jalali-moment"

interface ExpenseItemProps {
    title: string
    date: string
    amount: string
    description: string
    tags: string[]
}

const ExpenseItem = ({ title, date, amount, description, tags }: ExpenseItemProps) => {
    const persianDate = moment(date).locale('fa').format('jYYYY/jMM/jDD'); // Convert to Persian date

    return (
        <div className="p-6 border-b app_border_color last:border-b-0">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold app_text_color mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{persianDate}</p>
                    <div className="flex gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="text-sm px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <span className="text-red-500 text-2xl font-bold">
                    {amount}
                </span>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    )
}

export default ExpenseItem
