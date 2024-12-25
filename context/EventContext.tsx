'use client';

import { deleteMemberReq } from "@/app/actions/event";
import { updateEventStatusReq } from "@/app/actions/events";
import DashboardLoading from "@/components/Layout/DashboardLoading";
import { generateUID, TomanPriceFormatter } from "@/helpers/helpers";
import { useEventStore } from "@/store/event-store";
import { Toast, useToastStore } from "@/store/toast-store";
import { Event, Expense, Member, SettlePerson } from "@/types/event-types";
import { useParams } from "next/navigation";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export type EventContextType = {
    event: Event;
    getAllCosts: () => number;
    getCostsCount: () => number;
    getTransfersCount: () => number;
    getMostCost: () => number;
    getHighestTransfer: () => number;
    getAllPersonExpends: (personId: string) => number;
    getAllPersonDebts: (personId: string) => number;
    getAllPersonRecieved: (personId: string) => number;
    getAllPersonSent: (personId: string) => number;
    getMaxPayer: () => { name: string, amount: number };
    getPersonBalance: (personId: string) => number;
    getPersonBalanceStatus: (personId: string) => string;
    toggleEventStatus: () => void;
    addMember: (member: Member) => void;
    addExpense: (expense: Expense) => void;
    setMembers: (members: Member[]) => void;
    deleteMember: (memberId: number) => void;
    updateMember: (memberId: number, updatedMember: Member) => void;
    creditors: SettlePerson[];
    debtors: SettlePerson[];
    transactions: string[];
}

const EventContextInit = {
    event: {} as Event,
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
    updateMember: () => { },
    creditors: [],
    debtors: [],
    transactions: [],
}


export const EventContext = createContext<EventContextType>(EventContextInit);

export function EventContextProvider({ children, eventData }: { children: React.ReactNode, eventData: Event }) {

    const [loading, setLoading] = useState(false)
    const [event, setEvent] = useState<Event>(eventData)
    const addToast = useToastStore(state => state.addToast)


    // const { events, activeFilters, applyFilters } = useEventStore(state => state);
    // const event = useMemo(() => events.find(e => e.slug === event_slug), [events, event_slug]);

    // useEffect(() => {

    //     console.log('expenses changed')
    //     if (!!activeFilters) {
    //         applyFilters(activeFilters, event.id)
    //     }

    // }, [event, event.expenses, activeFilters])

    function addMember(member: Member) {
        setEvent(prevState => ({ ...prevState, members: [...prevState.members, member] }))
    }

    function setMembers(members: Member[]) {
        setEvent(prevState => ({ ...prevState, members: members }))
    }

    async function deleteMember(memberId: number) {

        const res = await deleteMemberReq(event.id.toString(), memberId)

        if (res.success) {
            setEvent(prevState => ({ ...prevState, members: prevState.members.filter(m => m.id !== memberId) }));


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

    async function updateMember(memberId: number, updatedMember: Member) {
        setEvent(prevState => ({ ...prevState, members: prevState.members.map(m => m.id === memberId ? updatedMember : m) }));
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

    const getAllPersonExpends = useCallback((personId: string) => {
        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'expend' && expense.payer_id === personId) {
                total += expense.amount;
            }
        });

        return total;
    }, [event.members, event.expenses]);

    const getAllPersonDebts = useCallback((personId: string) => {
        let total = 0;


        event.expenses.forEach(expense => {
            let contributorIds = expense.type === 'expend' ? expense.contributors.map(c => c.id.toString()) : [];
            if (expense.type === 'expend' && contributorIds.includes(personId)) {
                total += expense.amount / expense.contributors.length;
            }
        });

        return total;
    }, [event.members, event.expenses]);

    const getAllPersonRecieved = useCallback((personId: string) => {

        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'transfer' && expense.receiver_id === personId) {
                total += expense.amount;
            }
        })

        return total;

    }, [event.members, event.expenses])

    const getAllPersonSent = useCallback((personId: string) => {

        let total = 0;

        event.expenses.forEach(expense => {
            if (expense.type === 'transfer' && expense.transmitter_id === personId) {
                total += expense.amount;
            }
        })

        return total;

    }, [event.members, event.expenses])


    const getMaxPayer = useCallback(() => {

        let maxPayer = '';
        let paid = 0;

        event.members.forEach(person => {
            let personPaid = getAllPersonExpends(person.id.toString());
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
    }, [event.members, event.expenses]);

    const getPersonBalanceStatus = useCallback((personId: string) => {
        const personBalance = parseInt(getPersonBalance(personId).toFixed(0));
        if (personBalance > 999) {
            return 'طلبکار';
        } else if (personBalance < -999) {
            return 'بدهکار';
        } else {
            return 'تسویه';
        }
    }, [event.members, event.expenses]);

    const creditors = useMemo(() => {
        const creditorsArr: SettlePerson[] = [];
        event.members.forEach(person => {
            const personBalance = getPersonBalance(person.id.toString());

            if (personBalance > 0) {
                creditorsArr.push({
                    name: person.name,
                    amount: personBalance
                });
            }
        })

        return creditorsArr;
    }, [event.members, event.expenses]);

    const debtors = useMemo(() => {
        const debtorsArr: SettlePerson[] = [];
        event.members.forEach(person => {

            const personBalance = parseInt(getPersonBalance(person.id.toString().toString()).toFixed(0));

            if (personBalance < 0) {
                debtorsArr.push({
                    name: person.name,
                    amount: Math.abs(personBalance)
                });
            }
        })

        return debtorsArr;
    }, [event.members, event.expenses]);

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


    let values: EventContextType = {
        event,
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
        updateMember,
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