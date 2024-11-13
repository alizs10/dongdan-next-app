import { type Expense as ExpenseType } from "@/types/event-types";
import Expense from "./Expense";

function Expenses({ expenses }: { expenses: ExpenseType[] }) {
    return (
        <div className="py-3 flex flex-col">
            {expenses.map(expense => (
                <Expense key={expense.id} expense={expense} />
            ))}

        </div>
    );
}

export default Expenses;