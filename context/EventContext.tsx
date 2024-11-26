'use client';

import { TomanPriceFormatter } from "@/helpers/helpers";
import { useEventStore } from "@/store/event-store";
import { Event, SettlePerson } from "@/types/event-types";
import { useParams } from "next/navigation";
import { createContext, useCallback, useEffect, useMemo } from "react";

export type EventContextType = {
    event: Event | null;
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
    creditors: SettlePerson[];
    debtors: SettlePerson[];
    transactions: string[];
}

const EventContextInit = {
    event: null,
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
    creditors: [],
    debtors: [],
    transactions: [],
}


export const EventContext = createContext<EventContextType>(EventContextInit);

export function EventContextProvider({ children }: { children: React.ReactNode }) {

    const { event_id } = useParams()
    const { events, activeFilters, applyFilters } = useEventStore(state => state);
    const event = useMemo(() => events.find(e => e.id === event_id), [events, event_id]);

    if (!event) return null;


    useEffect(() => {

        console.log('expenses changed')
        if (!!activeFilters) {
            applyFilters(activeFilters, event.id)
        }

    }, [event, event.expenses, activeFilters])


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

    const getPersonBalanceStatus = useCallback((personId: string) => {
        const personBalance = parseInt(getPersonBalance(personId).toFixed(0));
        if (personBalance > 999) {
            return 'طلبکار';
        } else if (personBalance < -999) {
            return 'بدهکار';
        } else {
            return 'تسویه';
        }
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
        creditors,
        debtors,
        transactions,
    }


    return (
        <EventContext.Provider value={values}>
            {children}
        </EventContext.Provider>
    )
}