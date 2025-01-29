import { type Expense as ExpenseType } from "@/types/event-types";
import Expense from "./Expense";

function Expenses({ expenses }: { expenses: ExpenseType[] }) {

    // Sort expenses by date in descending order
    expenses = expenses.sort((a, b) => {
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison !== 0) return dateComparison;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return (
        <div className="flex flex-col min-h-[600px]">
            {expenses.map((expense, index) => (
                <Expense key={expense.id} index={index} expense={expense} />
            ))}
        </div>
    );
}

export default Expenses;