'use client'

import { CalendarCheck, CalendarClock, Copy, Filter, MoveRight, Plus, Share2, UserPlus, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import NoGroupMembers from "./NoGroupMembers";
import FiltersModal from "./FiltersModal";
import ActiveFilters from "./ActiveFilters";
import ShareEventLink from "./ShareEventLink";

function Event() {

    const addToast = useToastStore(state => state.addToast)
    const { event_id } = useParams()
    const { events, activateEvent, deactivateEvent, activeFilters, filteredExpenses, applyFilters } = useEventStore(state => state);
    const event = useMemo(() => events.find(e => e.id === event_id), [events, event_id]);

    if (!event) return null;

    // const expensesCount = event.expenses.filter(e => e.deletedAt).length;

    useEffect(() => {

        console.log('expenses changed')
        if (!!activeFilters) {
            applyFilters(activeFilters, event.id)
        }

    }, [event, event.expenses, activeFilters])

    const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
    const [isNewPersonModalOpen, setIsNewPersonModalOpen] = useState(false);
    const [isSettleHintsModalOpen, setIsSettleHintsModalOpen] = useState(false);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

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

    function toggleFiltersModal() {
        setIsFiltersModalOpen(prev => !prev);
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
        <div className="event_container">


            <aside className="col-span-1 lg:col-span-2 xl:col-span-1 border-l app_border_color flex flex-col">


                {event.group.length > 0 && (

                    <div className="p-3 flex flex-col gap-y-8 border-b app_border_color">
                        <div className="flex w-full justify-between items-center">
                            <h1 className="event_header_title">محاسبات</h1>
                            {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                        </div>

                        <ul className="flex flex-col gap-y-4">

                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400 font-semibold">مجموع هزینه ها</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getAllCosts().toString())} تومان</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد هزینه ها</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{getCostsCount()}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد جابجایی پول</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{getTransfersCount()}</span>
                            </div>

                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">بیشترین هزینه</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getMostCost().toString())} تومان</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">بیشترین جابجایی پول</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getHighestTransfer().toString())} تومان</span>
                            </div>



                        </ul>
                    </div>
                )}

                {event.group.length > 0 && (

                    <div className="p-3 flex flex-col gap-y-8 border-b app_border_color">
                        <div className="flex flex-row justify-between items-center">

                            <div className="flex w-full justify-between items-center">
                                <h1 className="event_header_title">سهم اعضا</h1>
                                {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                            </div>


                            <button onClick={toggleSettleHintsModal} className="flex flex-row flex-nowrap gap-x-2 items-center w-fit rounded-full px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-600">
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
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-500">
                                                طلبکار
                                            </span>
                                        )}
                                        {parseInt(getPersonBalance(person.id).toFixed(0)) < -999 && (
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-500">
                                                بدهکار
                                            </span>
                                        )}
                                        {(parseInt(getPersonBalance(person.id).toFixed(0)) > -1000 && parseInt(getPersonBalance(person.id).toFixed(0)) < 1000) && (
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                                                تسویه
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(Math.abs(getPersonBalance(person.id)).toFixed(0))} تومان</span>
                                </li>
                            ))}


                        </ul>
                    </div>
                )}



                <div className="h-fit px-3 py-5 flex flex-col gap-y-8 border-b app_border_color">
                    <div className="flex w-full flex-row gap-x-2 items-center">
                        <h1 className="event_header_title">اعضای گروه</h1>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{`${event.group.length}  نفر`}</span>
                    </div>

                    {event.group.length > 0 ? (
                        <GroupMembers group={event.group} isEventDeleted={event.deletedAt !== null} />
                    ) : (
                        <NoGroupMembers eventStatus={event.status} isDeleted={event.deletedAt !== null} />
                    )}

                    {event.status === 'active' && event.deletedAt === null && (
                        <Button
                            text="افزودن عضو جدید"
                            color="gray"
                            onClick={openNewPersonModal}
                            size="small"
                            icon={<UserPlus className="size-4" />}
                        />
                    )}

                </div>

                <div className="px-3 py-5 flex flex-col gap-y-8">
                    <div className="flex w-full justify-between items-center">
                        <h1 className="event_header_title">اطلاعات رویداد</h1>
                        {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                    </div>

                    <ul className="flex flex-col gap-y-4">

                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400 font-semibold">وضعیت</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.status === 'active' ? 'درجریان' : 'به پایان رسیده'}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">برچسب</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.label}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">تاریخ شروع</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{moment(event.date).locale('fa').format("DD MMM، YYYY")}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد اعضا</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.group.length}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">مادرخرج</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{getMaxPayer().name || '-'}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">هزینه های مادرخرج</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getMaxPayer().amount.toFixed(0))} تومان</span>
                        </div>

                        <ShareEventLink />



                    </ul>

                    {event.deletedAt === null && (

                        <Button
                            text={event.status === 'active' ? 'پایان رویداد' : 'باز کردن رویداد'}
                            color={event.status === 'active' ? 'danger' : 'success'}
                            onClick={toggleEventStatus}
                            size="small"
                            icon={event.status === 'active' ? <CalendarCheck className="size-4" /> : <CalendarClock className="size-4" />}
                        />
                    )}

                </div>
            </aside>

            <div className="flex flex-col order-first lg:order-none border-b app_border_color lg:border-b-0 col-span-3 h-fit min-h-[400px] lg:min-h-[600px]">
                <div className="event_header_container z-50">

                    <div className="event_header_right">
                        <Link href={event.deletedAt === null ? '/dashboard/events' : '/dashboard/events/trash'} className="event_back_button">
                            <MoveRight className="event_back_button_icon" />
                        </Link>
                        <h1 className="event_header_title">{event.name}</h1>
                    </div>

                    {event.group.length > 0 && (
                        <div className="event_header_left">
                            {event.expenses.length > 0 && (
                                <Button
                                    text="فیلتر"
                                    color="gray"
                                    onClick={toggleFiltersModal}
                                    size="small"
                                    icon={<Filter className="size-4" />}
                                />
                            )}
                            {event.expenses.length > 0 && isFiltersModalOpen && <FiltersModal event={event} onClose={toggleFiltersModal} />}
                            {event.status === 'active' && event.deletedAt === null && (
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

                    {activeFilters && (
                        <ActiveFilters />
                    )}

                </div>

                {(event.expenses.length > 0 && !activeFilters) || (activeFilters && filteredExpenses.length > 0) ? (
                    <Expenses expenses={activeFilters ? filteredExpenses : event.expenses} />
                ) : (event.deletedAt !== null || event.status === 'inactive' || (event.status === 'active' && event.group.length > 0)) ? <NoExpenses isFilterMode={!!activeFilters} isDeleted={event.deletedAt !== null} eventStatus={event.status} openNewExpenseModal={openNewExpenseModal} /> : (<NoGroupExpenses openNewPersonModal={openNewPersonModal} />)}


                {isNewExpenseModalOpen && <NewExpenseModal event={event} onClose={closeNewExpenseModal} />}
            </div>


            {isNewPersonModalOpen && <NewPersonModal onClose={closeNewPersonModal} />}

        </div>
    );
}

export default Event;