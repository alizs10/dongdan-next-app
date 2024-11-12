import { ArrowRightLeft, DollarSign, MoveLeft, ReceiptText } from "lucide-react";

function Expense({ type }: { type: 'transfer' | 'expend' }) {
    return (
        <div className="flex flex-wrap gap-4 justify-between border-b border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
                <div className={`p-3 rounded-full h-fit ${type === 'transfer' ? 'bg-orange-50 text-orange-300' : 'bg-green-50 text-green-400'}`}>
                    {type === 'transfer' ? (
                        <ArrowRightLeft className="size-6" />
                    ) : (
                        <DollarSign className="size-6" />
                    )}
                </div>

                <div className="flex flex-col gap-y-2 py-3">
                    <h2 className="text-base text-gray-700">{type === 'transfer' ? 'جابه جایی پول' : 'هزینه'}: کمک هزینه خرید</h2>
                    <div className="flex flex-wrap gap-x-4 items-center text-sm">
                        <span className="user_avatar_gray_text">علی</span>
                        <MoveLeft className="size-3.5 text-gray-500" />
                        {type === 'transfer' ? (
                            <span className="user_avatar_blue_text">امید</span>
                        ) : (
                            <span className="user_avatar_blue_text">4 نفر</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-3 flex flex-col gap-y-2 items-end">
                <span className="text-xs text-gray-500">27 اردیبهشت 1402</span>
                <span className="px-4 py-2 text-base font-semibold bg-indigo-100 text-indigo-900 rounded-full">1200000 تومان</span>
            </div>
        </div>
    );
}

export default Expense;