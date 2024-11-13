import { TomanPriceFormatter } from "@/helpers/helpers";
import { useEventStore } from "@/store/event-store";
import { type Event, type Expense } from "@/types/event-types";
import moment from "jalali-moment";
import { ArrowRightLeft, DollarSign, MoveLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useCallback } from "react";

function Expense({ expense }: { expense: Expense }) {
    const { event_id } = useParams()
    const events = useEventStore(state => state.events)

    const event = useMemo(() => events.find(event => event.id === event_id) as Event, [events, event_id]);

    const getPerson = useCallback((personId: string) => {
        return event.group.find(person => person.id === personId);
    }, [event]);

    return (
        <div className="flex flex-wrap gap-4 justify-between border-b border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
                <div className={`p-3 rounded-full h-fit ${expense.type === 'transfer' ? 'bg-orange-50 text-orange-300' : 'bg-green-50 text-green-400'}`}>
                    {expense.type === 'transfer' ? (
                        <ArrowRightLeft className="size-6" />
                    ) : (
                        <DollarSign className="size-6" />
                    )}
                </div>

                <div className="flex flex-col gap-y-2 py-3">
                    <h2 className="text-base text-gray-700">{expense.type === 'transfer' ? 'جابه جایی پول' : 'هزینه'}: {expense.desc}</h2>
                    <div className="flex flex-wrap gap-x-4 items-center text-sm">
                        <span className="user_avatar_gray_text">{expense.type === 'expend' ? getPerson(expense.payer)?.name ?? '?' : getPerson(expense.from)?.name ?? '?'}</span>
                        <MoveLeft className="size-3.5 text-gray-500" />
                        {expense.type === 'transfer' ? (
                            <span className={`user_avatar_${getPerson(expense.to)?.scheme ?? 'gray'}_text`}>{getPerson(expense.to)?.name ?? '?'}</span>
                        ) : expense.group.length > 3 ? (
                            <span className={`user_avatar_blue_text`}>{expense.group.length} نفر</span>
                        ) : <div className="flex flex-wrap gap-x-2">
                            {expense.group.map((person, index) => (
                                <span key={person} className={`text-xs user_avatar_${getPerson(person)?.scheme ?? 'blue'}_text`}>{getPerson(person)?.name ?? '?'}{index < expense.group.length - 1 && '،'}</span>
                            ))}
                        </div>}
                    </div>
                </div>
            </div>

            <div className="p-3 flex flex-col gap-y-2 items-end">
                <span className="text-xs text-gray-500">{moment(expense.date).locale('fa').format("DD MMM، YYYY")}</span>
                <span className="px-4 py-2 text-base font-semibold bg-indigo-100 text-indigo-900 rounded-full">{TomanPriceFormatter(expense.amount.toString())} تومان</span>
            </div>
        </div>
    );
}

export default Expense;