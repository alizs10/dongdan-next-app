'use client';

import { deleteExpenseReq, deleteMemberReq, getEventExpensesReq } from "@/app/actions/event";
import { updateEventStatusReq } from "@/app/actions/events";
import DashboardLoading from "@/components/Layout/DashboardLoading";
import { arraysHaveSameValues, isDateBetween, TomanPriceFormatter, TomanPriceToNumber } from "@/helpers/helpers";
import { useAppStore } from "@/store/app-store";
import { useToastStore } from "@/store/toast-store";
import { Event, Expend, Expense, ExpenseFilters, Member, SettlePerson, Transfer } from "@/types/event-types";
import { act, createContext, useCallback, useEffect, useMemo, useState } from "react";

export type SettlementTransactions = {
    transmitter: SettlePerson;
    receiver: SettlePerson;
    amount: number;
}

export type EventContextType = {
    event: Event;
    applyFilters: (filters: ExpenseFilters) => void;
    filteredExpenses: Expense[];
    activeFilters: ExpenseFilters | null;
    clearFilters: () => void;
    getAllCosts: () => number;
    getCostsCount: () => number;
    getTransfersCount: () => number;
    getMostCost: () => number;
    getHighestTransfer: () => number;
    getAllPersonExpends: (memberId: string) => number;
    getAllPersonDebts: (memberId: string) => number;
    getAllPersonRecieved: (memberId: string) => number;
    getAllPersonSent: (memberId: string) => number;
    getMaxPayer: () => { name: string, amount: number };
    getPersonBalance: (memberId: string) => number;
    getPersonBalanceStatus: (memberId: string) => string;
    toggleEventStatus: () => void;
    addMember: (member: Member) => void;
    addExpense: (expense: Expense) => void;
    setMembers: (members: Member[]) => void;
    deleteMember: (memberId: number) => void;
    deleteExpense: (expenseId: number) => void;
    deleteMultiExpenses: (expenseIds: string[]) => void;
    updateMember: (memberId: number, updatedMember: Member) => void;
    updateExpense: (expenseId: number, updatedExpense: Expense) => void;
    creditors: SettlePerson[];
    debtors: SettlePerson[];
    transactions: {
        hints: string[];
        transactions: SettlementTransactions[];
    };
}

const EventContextInit = {
    event: {} as Event,
    applyFilters: () => { },
    filteredExpenses: [],
    activeFilters: null,
    clearFilters: () => { },
    getAllCosts: () => 0,
    getCostsCount: () => 0,
    getTransfersCount: () => 0,
    getMostCost: () => 0,
    getHighestTransfer: () => 0,
    getAllPersonExpends: () => 0,
    getAllPersonDebts: () => 0,
    getAllPersonRecieved: () => 0,
    getAllPersonSent: () => 0,
    getMaxPayer: () => ({ name: '', amount: 0 }),
    getPersonBalance: () => 0,
    getPersonBalanceStatus: () => 'تسویه',
    toggleEventStatus: () => { },
    addMember: () => { },
    addExpense: () => { },
    setMembers: () => { },
    deleteMember: () => { },
    deleteExpense: () => { },
    deleteMultiExpenses: () => { },
    updateMember: () => { },
    updateExpense: () => { },
    creditors: [],
    debtors: [],
    transactions: { hints: [], transactions: [] },
}


export const EventContext = createContext<EventContextType>(EventContextInit);

export function EventContextProvider({ children, eventData }: { children: React.ReactNode, eventData: Event }) {

    const { user, settings } = useAppStore(state => state)
    const addToast = useToastStore(state => state.addToast)

    const [loading, setLoading] = useState(false)
    const [event, setEvent] = useState<Event>(eventData)
    const [activeFilters, setActiveFilters] = useState<ExpenseFilters | null>(null)
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])

    useEffect(() => {

        if (!!activeFilters) {
            applyFilters(activeFilters)
        }

    }, [event.expenses, activeFilters])

    function applyFilters(filters: ExpenseFilters) {
        // Start with base expenses based on type filter
        let results = filters.type === 'any'
            ? [...event.expenses]
            : event.expenses.filter(exp => exp.type === filters.type);

        // Apply amount range filter
        results = results.filter(exp => {
            const amount = TomanPriceToNumber(exp.amount.toString());
            const min = TomanPriceToNumber(filters.amountMin.toString());
            const max = TomanPriceToNumber(filters.amountMax.toString());
            return amount >= min && amount < max;
        });

        // Apply date range filter 
        results = results.filter(exp =>
            isDateBetween(exp.date, filters.dateRange[0], filters.dateRange[1])
        );
        // Apply expense-specific filters



        if (filters.type === 'expend') {
            // Filter by payer
            if (filters.payer_id) {
                results = results.filter(exp =>
                    (exp as Expend).payer_id.toString() === filters.payer_id
                );
            }

            // Filter by contributors
            if (filters.contributors?.length > 0) {
                results = results.filter(exp => {

                    const contributors = (exp as Expend).contributors.map(p => p.event_member?.id.toString()).filter((c): c is string => c !== undefined)
                    return arraysHaveSameValues(
                        contributors,
                        filters.contributors
                    )
                }
                );
            }
        }


        // Apply transfer-specific filters
        if (filters.type === 'transfer') {
            // Filter by transmitter
            if (filters.transmitter_id) {
                results = results.filter(exp =>
                    (exp as Transfer).transmitter_id.toString() === filters.transmitter_id
                );
            }

            // Filter by receiver
            if (filters.receiver_id) {
                results = results.filter(exp =>
                    (exp as Transfer).receiver_id.toString() === filters.receiver_id
                );
            }
        }


        setFilteredExpenses(results);
        setActiveFilters(filters);
    }

    function clearFilters() {
        setActiveFilters(null)
        setFilteredExpenses([])
    }

    function addMember(member: Member) {
        setEvent(prevState => ({ ...prevState, members: [...prevState.members, member] }))
    }

    function setMembers(members: Member[]) {
        setEvent(prevState => ({ ...prevState, members: members }))
    }

    async function deleteMember(memberId: number) {

        const res = await deleteMemberReq(event.id.toString(), memberId)

        if (res.success) {

            const res2 = await getEventExpensesReq(event.id)

            if (res2.success) {

                setEvent(prevState => ({ ...prevState, members: prevState.members.filter(m => m.id !== memberId), expenses: res2.expenses }));

                const successToast = {
                    message: res.message,
                    type: 'success' as const,
                }
                addToast(successToast)
                return;

            }


            const errorToast = {
                message: res2.message,
                type: 'danger' as const,
            }
            addToast(errorToast)
            return;
        }

        const errorToast = {
            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)

    }

    async function deleteExpense(expenseId: number) {

        const res = await deleteExpenseReq(event.id.toString(), expenseId)

        if (res.success) {
            setEvent(prevState => ({ ...prevState, expenses: prevState.expenses.filter(m => m.id !== expenseId) }));


            const successToast = {
                message: res.message,
                type: 'success' as const,
            }
            addToast(successToast)

            return;
        }

        const errorToast = {
            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)

    }

    function deleteMultiExpenses(expenseIds: string[]) {
        setEvent(prevState => ({ ...prevState, expenses: prevState.expenses.filter(e => !expenseIds.includes(e.id.toString())) }));
    }

    async function updateMember(memberId: number, updatedMember: Member) {
        setEvent(prevState => ({ ...prevState, members: prevState.members.map(m => m.id === memberId ? updatedMember : m) }));
    }

    async function updateExpense(expenseId: number, updatedExpense: Expense) {
        setEvent(prevState => ({ ...prevState, expenses: prevState.expenses.map(e => e.id === expenseId ? updatedExpense : e) }));
    }


    function addExpense(expense: Expense) {
        setEvent(prevState => ({ ...prevState, expenses: [...prevState.expenses, expense] }))
    }

    async function toggleEventStatus() {

        const res = await updateEventStatusReq(event.id.toString())

        if (res.success) {
            const event_end_date = res.end_date;
            const eventStatus = !event_end_date ? 'active' : 'inactive';
            setEvent(prevState => ({ ...prevState, end_date: event_end_date }));
            if (eventStatus === 'inactive') {
                const deactivateToast = {

                    message: 'رویداد به پایان رسید',
                    type: 'success' as const,
                }
                addToast(deactivateToast)
            } else {
                const activateToast = {

                    message: 'رویداد در جریان است',
                    type: 'success' as const,
                }
                addToast(activateToast)
            }
            return;
        }

        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)

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

    const getAllPersonExpends = useCallback((memberId: string) => {
        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'expend' && expense.payer_id.toString() === memberId) {
                total += expense.amount;
            }
        });

        return total;
    }, [event.members, event.expenses]);

    const getAllPersonDebts = useCallback((memberId: string) => {
        let total = 0;

        event.expenses.forEach(expense => {
            let contributorIds = expense.type === 'expend' ? expense.contributors.map(c => c.event_member_id.toString()) : [];
            if (expense.type === 'expend' && contributorIds.includes(memberId)) {
                const contributor = expense.contributors.find(c => c.event_member_id.toString() === memberId);
                total += contributor?.amount ?? 0;
            }
        });

        return total;
    }, [event.members, event.expenses]);

    const getAllPersonRecieved = useCallback((memberId: string) => {

        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'transfer' && expense.receiver_id.toString() === memberId) {
                total += expense.amount;
            }
        })

        return total;

    }, [event.members, event.expenses])

    const getAllPersonSent = useCallback((memberId: string) => {

        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'transfer' && expense.transmitter_id.toString() === memberId) {
                total += expense.amount;
            }
        })

        return total;

    }, [event.members, event.expenses])


    const getMaxPayer = useCallback(() => {

        let maxPayer = '';
        let paid = 0;

        if (!user || !settings) return { name: '', amount: 0 };

        event.members.forEach(member => {
            let memberPaid = getAllPersonExpends(member.id.toString());
            if (memberPaid > paid) {
                paid = memberPaid;
                maxPayer = user.id === member.member_id ? settings.show_as_me ? 'خودم' : user.name : member.name;
            }
        })

        return { name: maxPayer, amount: paid };
    }, [event.expenses, settings, user]);


    const getPersonBalance = useCallback((memberId: string) => {

        const memberDebts = getAllPersonDebts(memberId);
        const memberRecieved = getAllPersonRecieved(memberId);
        const memberSent = getAllPersonSent(memberId);
        const memberExpends = getAllPersonExpends(memberId);
        const memberBalance = (memberSent + memberExpends - memberRecieved - memberDebts);

        return (memberBalance > 0 || memberBalance < 0) ? memberBalance : 0;
    }, [event.members, event.expenses, settings]);

    const getPersonBalanceStatus = useCallback((memberId: string) => {
        const memberBalance = getPersonBalance(memberId);
        if (memberBalance > 0) {
            return 'طلبکار';
        } else if (memberBalance < 0) {
            return 'بدهکار';
        } else {
            return 'تسویه';
        }
    }, [event.members, event.expenses]);

    const creditors = useMemo(() => {
        const creditorsArr: SettlePerson[] = [];
        event.members.forEach(member => {
            const memberBalance = getPersonBalance(member.id.toString());

            if (memberBalance > 0) {
                creditorsArr.push({
                    ...member,
                    amount: memberBalance,
                });
            }
        })

        return creditorsArr;
    }, [event.members, event.expenses]);

    const debtors = useMemo(() => {
        const debtorsArr: SettlePerson[] = [];
        event.members.forEach(member => {

            const memberBalance = getPersonBalance(member.id.toString());

            if (memberBalance < 0) {
                debtorsArr.push({
                    ...member,
                    amount: Math.abs(memberBalance),
                });
            }
        })

        return debtorsArr;
    }, [event.members, event.expenses]);

    const transactions = useMemo(() => {

        if (!user) return { hints: [], transactions: [] }

        const transactions: SettlementTransactions[] = [];

        // Sort debtors and creditors by the amount
        debtors.sort((a, b) => b.amount - a.amount);
        creditors.sort((a, b) => b.amount - a.amount);

        const hints: string[] = [];
        let i = 0, j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];
            const transactionAmount = Math.min(debtor.amount, creditor.amount);

            const debtorName = debtor.member_id === user?.id ? 'من' : debtor.name;
            const creditorName = creditor.member_id === user?.id ? 'من' : creditor.name;

            transactions.push({
                transmitter: debtor,
                receiver: creditor,
                amount: transactionAmount,
            });

            hints.push(`${debtorName} باید مقدار ${TomanPriceFormatter(transactionAmount.toString())} تومان به ${creditorName} پرداخت ${debtorName === 'من' ? 'کنم' : 'کند'}.`);
            debtor.amount -= transactionAmount;
            creditor.amount -= transactionAmount;

            if (debtor.amount === 0) i++;
            if (creditor.amount === 0) j++;
        }
        return { hints, transactions };
    }, [debtors, creditors, user]);


    let values: EventContextType = {
        event,
        applyFilters,
        clearFilters,
        filteredExpenses,
        activeFilters,
        getAllCosts,
        getCostsCount,
        getTransfersCount,
        getMostCost,
        getHighestTransfer,
        getAllPersonExpends,
        getAllPersonDebts,
        getAllPersonRecieved,
        getAllPersonSent,
        getMaxPayer,
        getPersonBalance,
        getPersonBalanceStatus,
        toggleEventStatus,
        addMember,
        setMembers,
        deleteMember,
        deleteExpense,
        deleteMultiExpenses,
        updateMember,
        updateExpense,
        addExpense,
        creditors,
        debtors,
        transactions,
    }


    if (loading) {
        <DashboardLoading />
    }

    return (
        <EventContext.Provider value={values}>
            {children}
        </EventContext.Provider>
    )
}