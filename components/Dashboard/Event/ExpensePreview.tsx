import { Zap } from "lucide-react";

function ExpensePreview() {
    return (
        <div className="mx-5 px-5 py-2 items-center rounded-xl bg-indigo-100 text-indigo-900 flex gap-x-4 text-sm">
            <Zap className="size-4" />
            <span>
                علی برای 4 نفر به دلیل خرید پوشاک مقدار 200000 تومان هزینه کرده است.
            </span>
        </div>
    );
}

export default ExpensePreview;