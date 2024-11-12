import Expense from "./Expense";

function Expenses() {
    return (
        <div className="py-3 flex flex-col">
            <Expense type="expend" />
            <Expense type="transfer" />
            <Expense type="expend" />
            <Expense type="expend" />
        </div>
    );
}

export default Expenses;