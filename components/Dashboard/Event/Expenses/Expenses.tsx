import { type Expense as ExpenseType } from "@/types/event-types";
import Expense from "./Expense";

function Expenses({ expenses }: { expenses: ExpenseType[] }) {

    // Sort expenses by date in descending order
    expenses = expenses.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <div className="flex flex-col min-h-[600px]">
            {expenses.map(expense => (
                <Expense key={expense.id} expense={expense} />
            ))}
        </div>
    );
}

export default Expenses;