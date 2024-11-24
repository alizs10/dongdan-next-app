import { Zap } from "lucide-react";

type PropsTypes = {
    type: 'expend' | 'transfer';
    desc: string;
    amount: string;
    payer?: string | null;
    from?: string | null;
    to?: string | null;
    group?: string[];
}

function ExpensePreview({ type, desc, amount, payer, group, to, from }: PropsTypes) {

    return (
        <div className="mx-5 px-5 py-2 items-center rounded-xl bg-indigo-100 dark:bg-indigo-950/30 primary_text_color text-sm">
            <Zap className="size-4 mt-0.5 ml-2 float-right" />
            {type === 'expend' ? (
                <span>
                    {payer} برای {group?.length} نفر به دلیل {desc} مقدار {amount} تومان هزینه کرده است.
                </span>

            ) : (
                <span>
                    {from} برای {to} به دلیل {desc} مقدار {amount} تومان انتقال داده است.
                </span>
            )}
        </div>
    );
}

export default ExpensePreview;