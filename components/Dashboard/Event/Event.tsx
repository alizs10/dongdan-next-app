'use client'

import { CalendarCheck, CalendarClock, Ellipsis, Filter, Group, MoveRight, Pencil, Plus, Trash, User, UserPlus, Zap } from "lucide-react";
import styles from "./Event.module.css";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import NewExpenseModal from "./NewExpenseModal";
import NewPersonModal from "./NewPersonModal";
import Expenses from "./Expenses/Expenses";
import { useParams } from "next/navigation";
import { useEventStore } from "@/store/event-store";
import NoExpenses from "./Expenses/NoExpenses";
import NoGroupExpenses from "./Expenses/NoGroupExpenses";
import moment from "jalali-moment";
import Button from "@/components/Common/Button";
import { generateUID, TomanPriceFormatter } from "@/helpers/helpers";
import { SettlePerson } from "@/types/event-types";

import SettleHintsModal from "./SettleHintsModal";
import GroupMembers from "./GroupMembers";
import { Toast, useToastStore } from "@/store/toast-store";

function Event() {

    const addToast = useToastStore(state => state.addToast)
    const { event_id } = useParams()
    const { events, activateEvent, deactivateEvent } = useEventStore(state => state);
    const event = useMemo(() => events.find(e => e.id === event_id), [events, event_id]);

    if (!event) return null;

    const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
    const [isNewPersonModalOpen, setIsNewPersonModalOpen] = useState(false);
    const [isSettleHintsModalOpen, setIsSettleHintsModalOpen] = useState(false);

    function openNewExpenseModal() {
        if (event?.group.length === 0 || event?.status === 'inactive') return
        setIsNewExpenseModalOpen(true);
    }

    function closeNewExpenseModal() {
        setIsNewExpenseModalOpen(false);
    }

    function openNewPersonModal() {
        if (event?.status === 'inactive') return
        setIsNewPersonModalOpen(true);
    }

    function closeNewPersonModal() {
        setIsNewPersonModalOpen(false);
    }

    function toggleSettleHintsModal() {
        setIsSettleHintsModalOpen(prev => !prev);
    }

    const getAllCosts = useCallback(() => {
        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'expend') {
                total += expense.amount;
            }
        });
        return total;
    }, [event.expenses]);

    const getCostsCount = useCallback(() => {
        return event.expenses.filter(e => e.type === 'expend').length;
    }, [event.expenses]);

    const getTransfersCount = useCallback(() => {
        return event.expenses.filter(e => e.type === 'transfer').length;
    }, [event.expenses]);

    const getMostCost = useCallback(() => {

        let max = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'expend' && expense.amount > max) {
                max = expense.amount;
            }
        });

        return max;

    }, [event.expenses]);

    const getHighestTransfer = useCallback(() => {
        let max = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'transfer' && expense.amount > max) {
                max = expense.amount;
            }
        });

        return max;
    }, [event.expenses]);

    const getAllPersonExpends = useCallback((personId: string) => {
        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'expend' && expense.payer === personId) {
                total += expense.amount;
            }
        });

        return total;
    }, [event.group, event.expenses]);

    const getAllPersonDebts = useCallback((personId: string) => {
        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'expend' && expense.group.includes(personId)) {
                total += expense.amount / expense.group.length;
            }
        });

        return total;
    }, [event.group, event.expenses]);

    const getAllPersonRecieved = useCallback((personId: string) => {

        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'transfer' && expense.to === personId) {
                total += expense.amount;
            }
        })

        return total;

    }, [event.group, event.expenses])

    const getAllPersonSent = useCallback((personId: string) => {

        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'transfer' && expense.from === personId) {
                total += expense.amount;
            }
        })

        return total;

    }, [event.group, event.expenses])


    const getMaxPayer = useCallback(() => {

        let maxPayer = '';
        let paid = 0;

        event.group.forEach(person => {
            let personPaid = getAllPersonExpends(person.id);
            if (personPaid > paid) {
                paid = personPaid;
                maxPayer = person.name;
            }
        })

        return { name: maxPayer, amount: paid };
    }, [event.expenses]);

    const getPersonBalance = useCallback((personId: string) => {
        const personDebts = getAllPersonDebts(personId);
        const personRecieved = getAllPersonRecieved(personId);
        const personSent = getAllPersonSent(personId);
        const personExpends = getAllPersonExpends(personId);
        const personBalance = (personSent + personExpends - personRecieved - personDebts);
        return personBalance;
    }, [event.group, event.expenses]);


    const creditors = useMemo(() => {
        const creditorsArr: SettlePerson[] = [];
        event.group.forEach(person => {
            const personBalance = getPersonBalance(person.id);

            if (personBalance > 0) {
                creditorsArr.push({
                    name: person.name,
                    amount: personBalance
                });
            }
        })

        return creditorsArr;
    }, [event.group, event.expenses]);

    const debtors = useMemo(() => {
        const debtorsArr: SettlePerson[] = [];
        event.group.forEach(person => {

            const personBalance = parseInt(getPersonBalance(person.id).toFixed(0));

            if (personBalance < 0) {
                debtorsArr.push({
                    name: person.name,
                    amount: Math.abs(personBalance)
                });
            }
        })

        return debtorsArr;
    }, [event.group, event.expenses]);

    const transactions = useMemo(() => {
        // Sort debtors and creditors by the amount
        debtors.sort((a, b) => b.amount - a.amount);
        creditors.sort((a, b) => b.amount - a.amount);


        const transactions: string[] = [];
        let i = 0, j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];
            const transactionAmount = Math.min(debtor.amount, creditor.amount);
            transactions.push(`${debtor.name} باید مقدار ${TomanPriceFormatter(transactionAmount.toFixed(0))} تومان به ${creditor.name} پرداخت کند.`);
            debtor.amount -= transactionAmount;
            creditor.amount -= transactionAmount;

            if (debtor.amount === 0) i++;
            if (creditor.amount === 0) j++;
        }

        return transactions;
    }, [debtors, creditors]);


    function toggleEventStatus() {

        if (!event) return;



        if (event.status === 'active') {
            let deactivateToast: Toast = {
                id: generateUID(),
                message: 'رویداد به پایان رسید',
                type: 'success'
            }
            deactivateEvent(event.id);
            addToast(deactivateToast)
        } else {
            let activateToast: Toast = {
                id: generateUID(),
                message: 'رویداد در جریان است',
                type: 'success'
            }
            activateEvent(event.id);
            addToast(activateToast)
        }
    }

    return (
        <div className={styles.event_container}>
            <div className={styles.header_container}>

                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>{event.name}</h1>
                </div>

                {event.group.length > 0 && (
                    <div className={styles.header_left}>
                        <Button
                            text="فیلتر"
                            color="gray"
                            onClick={() => { }}
                            size="small"
                            icon={<Filter className="size-4" />}
                        />
                        {event.status === 'active' && (
                            <Button
                                text="ثبت هزینه/جابجایی پول"
                                color="accent"
                                onClick={openNewExpenseModal}
                                size="small"
                                icon={<Plus className="size-4" />}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4">

                <div className="col-span-3">

                    {event.group.length > 0 ? (
                        <Expenses expenses={event.expenses} />
                    ) : <NoGroupExpenses openNewPersonModal={openNewPersonModal} />}

                    {(event.group.length > 0 && event.expenses.length === 0) && (
                        <NoExpenses openNewExpenseModal={openNewExpenseModal} />
                    )}

                    {isNewExpenseModalOpen && <NewExpenseModal event={event} onClose={closeNewExpenseModal} />}
                </div>

                <aside className="col-span-1 border-r border-gray-200 flex flex-col">


                    {event.group.length > 0 && (

                        <div className="p-3 flex flex-col gap-y-8 border-b border-gray-200">
                            <div className="flex w-full justify-between items-center">
                                <h1 className={styles.header_title}>محاسبات</h1>
                                {/* <span className="text-sm text-gray-500">8 نفر</span> */}
                            </div>

                            <ul className="flex flex-col gap-y-4">

                                <div className="flex w-full justify-between items-center">
                                    <h1 className="text-sm text-gray-500 font-semibold">مجموع هزینه ها</h1>
                                    <span className="text-sm text-gray-500">{TomanPriceFormatter(getAllCosts().toString())} تومان</span>
                                </div>
                                <div className="flex w-full justify-between items-center">
                                    <h1 className="text-sm text-gray-500">تعداد هزینه ها</h1>
                                    <span className="text-sm text-gray-500">{getCostsCount()}</span>
                                </div>
                                <div className="flex w-full justify-between items-center">
                                    <h1 className="text-sm text-gray-500">تعداد جابجایی پول</h1>
                                    <span className="text-sm text-gray-500">{getTransfersCount()}</span>
                                </div>

                                <div className="flex w-full justify-between items-center">
                                    <h1 className="text-sm text-gray-500">بیشترین هزینه</h1>
                                    <span className="text-sm text-gray-500">{TomanPriceFormatter(getMostCost().toString())} تومان</span>
                                </div>
                                <div className="flex w-full justify-between items-center">
                                    <h1 className="text-sm text-gray-500">بیشترین جابجایی پول</h1>
                                    <span className="text-sm text-gray-500">{TomanPriceFormatter(getHighestTransfer().toString())} تومان</span>
                                </div>



                            </ul>
                        </div>
                    )}

                    {event.group.length > 0 && (

                        <div className="p-3 flex flex-col gap-y-8 border-b border-gray-200">
                            <div className="flex flex-row justify-between items-center">

                                <div className="flex w-full justify-between items-center">
                                    <h1 className={styles.header_title}>سهم اعضا</h1>
                                    {/* <span className="text-sm text-gray-500">8 نفر</span> */}
                                </div>


                                <button onClick={toggleSettleHintsModal} className="flex flex-row flex-nowrap gap-x-2 items-center w-fit rounded-full px-3 py-1.5 bg-indigo-50 text-indigo-700">
                                    <Zap className="size-4" />
                                    <p className="text-[.7rem] font-semibold text-nowrap">
                                        راهنمای تسویه
                                    </p>
                                </button>

                                {isSettleHintsModalOpen && (
                                    <SettleHintsModal transactions={transactions} onClose={toggleSettleHintsModal} />
                                )}
                            </div>


                            <ul className="flex flex-col gap-y-4">

                                {event.group.map(person => (
                                    <li key={person.id} className="flex w-full justify-between items-center">
                                        <div className="flex flex-row gap-x-2 justify-center items-center">
                                            <h1 className={`user_avatar_${person.scheme}_text`}>{person.name}</h1>
                                            {parseInt(getPersonBalance(person.id).toFixed(0)) > 999 && (
                                                <span className="text-[.6rem] font-semibold rounded-full px-2 py-1 bg-green-100 text-green-700">
                                                    طلبکار
                                                </span>
                                            )}
                                            {parseInt(getPersonBalance(person.id).toFixed(0)) < -999 && (
                                                <span className="text-[.6rem] font-semibold rounded-full px-2 py-1 bg-red-100 text-red-600">
                                                    بدهکار
                                                </span>
                                            )}
                                            {(parseInt(getPersonBalance(person.id).toFixed(0)) > -1000 && parseInt(getPersonBalance(person.id).toFixed(0)) < 1000) && (
                                                <span className="text-[.6rem] font-semibold rounded-full px-2 py-1 bg-gray-200 text-gray-700">
                                                    تسویه
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">{TomanPriceFormatter(Math.abs(getPersonBalance(person.id)).toFixed(0))} تومان</span>
                                    </li>
                                ))}


                            </ul>
                        </div>
                    )}



                    <div className="h-full p-3 flex flex-col gap-y-8 border-b border-gray-200">
                        <div className="flex w-full justify-between items-center">
                            <h1 className={styles.header_title}>اعضای گروه</h1>
                            <span className="text-sm text-gray-500">{event.group.length} نفر</span>
                        </div>

                        <GroupMembers group={event.group} />


                        {event.status === 'active' && (
                            <Button
                                text="افزودن عضو جدید"
                                color="gray"
                                onClick={openNewPersonModal}
                                size="small"
                                icon={<UserPlus className="size-4" />}
                            />
                        )}

                    </div>

                    <div className="p-3 flex flex-col gap-y-8">
                        <div className="flex w-full justify-between items-center">
                            <h1 className={styles.header_title}>اطلاعات رویداد</h1>
                            {/* <span className="text-sm text-gray-500">8 نفر</span> */}
                        </div>

                        <ul className="flex flex-col gap-y-4">

                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 font-semibold">وضعیت</h1>
                                <span className="text-sm text-gray-500">{event.status === 'active' ? 'درجریان' : 'به پایان رسیده'}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">برچسب</h1>
                                <span className="text-sm text-gray-500">{event.label}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">تاریخ شروع</h1>
                                <span className="text-sm text-gray-500">{moment(event.date).locale('fa').format("DD MMM، YYYY")}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">تعداد اعضا</h1>
                                <span className="text-sm text-gray-500">{event.group.length}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">مادرخرج</h1>
                                <span className="text-sm text-gray-500">{getMaxPayer().name}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">هزینه های مادرخرج</h1>
                                <span className="text-sm text-gray-500">{TomanPriceFormatter(getMaxPayer().amount.toFixed(0))} تومان</span>
                            </div>



                        </ul>

                        <Button
                            text={event.status === 'active' ? 'پایان رویداد' : 'باز کردن رویداد'}
                            color={event.status === 'active' ? 'danger' : 'success'}
                            onClick={toggleEventStatus}
                            size="small"
                            icon={event.status === 'active' ? <CalendarCheck className="size-4" /> : <CalendarClock className="size-4" />}
                        />

                    </div>
                </aside>

                {isNewPersonModalOpen && <NewPersonModal onClose={closeNewPersonModal} />}
            </div>

        </div>
    );
}

export default Event;