import { Zap } from "lucide-react";

type PropsTypes = {
    type: 'expend' | 'transfer';
    description: string;
    amount: string;
    payer?: string | null;
    transmitter?: string | null;
    receiver?: string | null;
    contributors?: string[];
}

function ExpensePreview({ type, description, amount, payer, contributors, receiver, transmitter }: PropsTypes) {

    return (
        <div className="mx-5 px-5 py-2 items-center rounded-xl bg-indigo-100 dark:bg-indigo-950/30 primary_text_color text-sm">
            <Zap className="size-4 mt-0.5 ml-2 float-right" />
            {type === 'expend' ? (
                <span>
                    {payer === 'خودم' ? 'من' : payer} برای {contributors?.length} نفر به دلیل {description} مقدار {amount} تومان هزینه کرد{payer === 'خودم' ? 'م' : 'ه است'}.
                </span>

            ) : (
                <span>
                    {transmitter === 'خودم' ? 'من' : transmitter} برای {receiver === 'خودم' ? 'من' : receiver} به دلیل {description} مقدار {amount} تومان انتقال داد{transmitter === 'خودم' ? 'م' : 'ه است'}.
                </span>
            )}
        </div>
    );
}

export default ExpensePreview;