'use client';

import { deleteExpenseReq, deleteMemberReq, getEventExpensesReq, loadMoreExpensesReq } from "@/app/actions/event";
import { updateEventStatusReq } from "@/app/actions/events";
import { filterExpensesReq } from "@/app/actions/filter";
import DashboardLoading from "@/components/Layout/DashboardLoading";
import { TomanPriceFormatter } from "@/helpers/helpers";
import useStore from "@/store/store";


import { Event, Expense, Member, SettlePerson } from "@/types/event-types";
import { Pagination } from "@/types/globals";
import { DeleteMemberResponse, EventData, GetEventResponse } from "@/types/responses/event";
import { createContext, useCallback, useMemo, useState } from "react";

export type SettlementTransactions = {
    transmitter: SettlePerson;
    receiver: SettlePerson;
    amount: number;
}

export type EventContextType = {
    event: Event;
    updateEvent: (updatedEvent: Event) => void;
    eventData: EventData;
    expenses: Expense[];
    expensesToShow: Expense[];
    paginationData: Pagination;
    filteredExpenses: Expense[];
    filtersResultCount: number;
    filterQuery: string;
    isFiltering: boolean;
    filterPaginationData: Pagination | null;
    applyFilters: (query: string) => void;
    clearFilters: () => void;
    toggleEventStatus: (end_date?: Date) => void;
    addMember: (member: Member) => void;
    addExpense: (expense: Expense, event_data: EventData, event_members: Member[]) => void;
    loadMoreExpenses: () => void;
    fetchingMoreExpenses: boolean;
    setMembers: (members: Member[]) => void;
    deleteMember: (memberId: number) => void;
    deleteExpense: (expenseId: number, event_data: EventData, event_members: Member[]) => void;
    deleteMultiExpenses: (expenseIds: string[], event_data: EventData, event_members: Member[]) => void;
    updateMember: (memberId: number, updatedMember: Member) => void;
    updateExpense: (expenseId: number, updatedExpense: Expense, event_data: EventData, event_members: Member[]) => void;
    creditors: SettlePerson[];
    debtors: SettlePerson[];
    transactions: {
        hints: string[];
        transactions: SettlementTransactions[];
    };
    showMemberName: (memberId: number) => string;
}

const EventContextInit = {
    event: {} as Event,
    updateEvent: () => { },
    eventData: {} as EventData,
    expenses: [],
    expensesToShow: [],
    paginationData: {} as Pagination,
    applyFilters: () => { },
    filteredExpenses: [],
    filtersResultCount: 0,
    filterQuery: '',
    isFiltering: false,
    filterPaginationData: null,
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
    toggleEventStatus: async () => { },
    addMember: () => { },
    addExpense: () => { },
    loadMoreExpenses: () => { },
    fetchingMoreExpenses: false,
    setMembers: () => { },
    deleteMember: () => { },
    deleteExpense: () => { },
    deleteMultiExpenses: () => { },
    updateMember: () => { },
    updateExpense: () => { },
    creditors: [],
    debtors: [],
    transactions: { hints: [], transactions: [] },
    showMemberName: () => ''
}


export const EventContext = createContext<EventContextType>(EventContextInit);

export function EventContextProvider({ children, data }: { children: React.ReactNode, data: GetEventResponse }) {

    const { user, settings, addToast } = useStore()

    const [loading, setLoading] = useState(false)
    const [event, setEvent] = useState<Event>(data.event)
    const [eventData, setEventData] = useState<EventData>(data.event_data)
    const [expenses, setExpenses] = useState<Expense[]>(data.expenses_data.expenses)
    const [paginationData, setPaginationData] = useState<Pagination>(data.expenses_data.pagination)
    const [fetchingMoreExpenses, setFetchingMoreExpenses] = useState(false)

    const [filtersResultCount, setFiltersResultCount] = useState(0)
    const [filterQuery, setFilterQuery] = useState<string>('')
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
    const [isFiltering, setIsFiltering] = useState<boolean>(false)
    const [filterPaginationData, setFilterPaginationData] = useState<Pagination | null>(null)
    const expensesToShow = isFiltering ? filteredExpenses : expenses;

    function updateEvent(updatedEvent: Event) {
        setEvent(updatedEvent)
    }


    async function applyFilters(query: string) {

        setLoading(true)
        const res = await filterExpensesReq(event.id.toString(), query)

        if (res.success && res.expenses && res.paginationData) {
            setFilterQuery(query)
            setIsFiltering(true)
            setFilteredExpenses(res.expenses)
            setFilterPaginationData(res.paginationData)
            setFiltersResultCount(res.resCount)
            setLoading(false)
            return;

        }

        const errorToast = {
            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
        setLoading(false)
    }


    function clearFilters() {
        setFilterQuery('')
        setIsFiltering(false)
        setFilteredExpenses([])
        setFilterPaginationData(null)
        setFiltersResultCount(0)
    }

    const [excludeIds, setExcludeIds] = useState<number[]>([])


    function addMember(member: Member) {
        setEvent(prevState => ({ ...prevState, members: [...prevState.members, member] }))
    }

    function setMembers(members: Member[]) {
        setEvent(prevState => ({ ...prevState, members: members }))
    }

    async function deleteMember(memberId: number) {

        const res = await deleteMemberReq(event.id.toString(), memberId.toString())

        if (res.success && res.expenses && res.event_members && res.event_data) {

            setExpenses(res.expenses)
            setEvent(prevState => ({ ...prevState, members: res.event_members }))
            setEventData(res.event_data)

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

    async function deleteExpense(expenseId: number) {

        const res = await deleteExpenseReq(event.id.toString(), expenseId)

        if (res.success && res.event_data) {
            setExpenses(prevState => prevState.filter(e => e.id !== expenseId))
            setEventData(res.event_data)
            setEvent(prevState => ({ ...prevState, members: res.event_members }))

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

    function deleteMultiExpenses(expenseIds: string[], event_data: EventData, event_members: Member[]) {
        setExpenses(prevState => prevState.filter(e => !expenseIds.includes(e.id.toString())))
        setEvent(prevState => ({ ...prevState, members: event_members }))
        setEventData(event_data)
    }

    async function updateMember(memberId: number, updatedMember: Member) {
        setEvent(prevState => ({ ...prevState, members: prevState.members.map(m => m.id === memberId ? updatedMember : m) }));
    }

    async function updateExpense(expenseId: number, updatedExpense: Expense, event_data: EventData, event_members: Member[]) {
        setExpenses(prevState => prevState.map(e => e.id === expenseId ? updatedExpense : e))
        setEvent(prevState => ({ ...prevState, members: event_members }))
        setEventData(event_data)
    }


    function addExpense(expense: Expense, event_data: EventData, event_members: Member[]) {
        setExpenses(prevState => [...prevState, expense])
        setEventData(event_data)
        setEvent(prevState => ({ ...prevState, members: event_members }))
        setExcludeIds(prevState => [...prevState, expense.id])
    }


    async function loadMoreExpenses() {

        if (fetchingMoreExpenses) return;
        setFetchingMoreExpenses(true)

        if ((!isFiltering && !paginationData.next_cursor) || (isFiltering && !filterPaginationData?.next_cursor)) return;

        // fetch more expenses
        if (isFiltering) {
            const res = await filterExpensesReq(event.id.toString(), filterQuery, filterPaginationData!.next_cursor!, filterPaginationData!.next_cursor_id!, excludeIds)

            if (res.success && res.expenses && res.paginationData) {
                setFilteredExpenses(prevState => [...prevState, ...res.expenses])
                setFilterPaginationData(res.paginationData)
                setFetchingMoreExpenses(false)
                return;
            }

            const errorToast = {
                message: res.message,
                type: 'danger' as const,
            }
            addToast(errorToast)
            setFetchingMoreExpenses(false)
            return;

        } else {
            const res = await loadMoreExpensesReq(event.id.toString(), paginationData.next_cursor!, paginationData.next_cursor_id!, excludeIds)

            if (res.success && res.expenses && res.paginationData) {
                setExpenses(prevState => [...prevState, ...res.expenses])
                setPaginationData(res.paginationData)
                setFetchingMoreExpenses(false)
                return;
            }

            const errorToast = {
                message: res.message,
                type: 'danger' as const,
            }
            addToast(errorToast)
            setFetchingMoreExpenses(false)
            return;
        }

    }

    async function toggleEventStatus(end_date?: Date): Promise<boolean> {

        console.log("we are here")

        let res;

        if (end_date) {
            res = await updateEventStatusReq(event.id.toString(), end_date)
        } else {
            res = await updateEventStatusReq(event.id.toString())
        }

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
            return true;
        }

        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
        return false
    }


    const creditors = useMemo(() => {

        const creditorsArr: SettlePerson[] = [];

        event.members.forEach(member => {
            if (member.balance_status === 'creditor') {
                creditorsArr.push({
                    ...member,
                    amount: member.balance || 0,
                });
            }
        })

        return creditorsArr;
    }, [event.members]);

    const debtors = useMemo(() => {
        const debtorsArr: SettlePerson[] = [];
        event.members.forEach((member, index) => {


            console.log("debtor number ", index + 1)

            if (member.balance_status === 'debtor') {
                debtorsArr.push({
                    ...member,
                    amount: member.balance || 0,
                });
            }
        })

        return debtorsArr;
    }, [event.members]);


    const transactions = useMemo(() => {
        if (!user) return { hints: [], transactions: [] };

        const transactions: SettlementTransactions[] = [];

        // Sort debtors and creditors by absolute amount in descending order
        const sortedDebtors = debtors
            .map(d => ({ ...d })) // Copy objects to avoid mutation
            .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

        const sortedCreditors = creditors
            .map(c => ({ ...c }))
            .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

        const hints: string[] = [];
        let i = 0, j = 0;

        while (i < sortedDebtors.length && j < sortedCreditors.length) {
            const debtor = sortedDebtors[i];
            const creditor = sortedCreditors[j];

            if (debtor.amount === 0) {
                i++;
                continue;
            }
            if (creditor.amount === 0) {
                j++;
                continue;
            }

            const transactionAmount = Math.min(Math.abs(debtor.amount), Math.abs(creditor.amount));

            transactions.push({
                transmitter: { ...debtor },
                receiver: { ...creditor },
                amount: transactionAmount,
            });

            const debtorName = debtor.member_id === user?.id ? 'من' : debtor.name;
            const creditorName = creditor.member_id === user?.id ? 'من' : creditor.name;

            hints.push(`${debtorName} باید مقدار ${TomanPriceFormatter(transactionAmount.toString())} تومان به ${creditorName} پرداخت ${debtorName === 'من' ? 'کنم' : 'کند'}.`);

            // Deduct from both parties
            sortedDebtors[i].amount += transactionAmount; // Since debtors have negative amounts
            sortedCreditors[j].amount -= transactionAmount;

            // Move to the next debtor or creditor if fully settled
            if (sortedDebtors[i].amount === 0) i++;
            if (sortedCreditors[j].amount === 0) j++;
        }

        return { hints, transactions };
    }, [debtors, creditors, user]);

    const showMemberName = useCallback((memberId: number) => {

        if (!user) return '...';

        const member = event.members.find(member => member.id === memberId);
        if (!member) return 'ناشناس';
        let memberName = member.member_id === user.id ? settings.show_as_me ? 'خودم' : user.name : member.name;

        if (memberName.length > 12) {
            const memberNameArr = memberName.split(" ");
            memberName = memberNameArr.length > 1 ? memberNameArr[1] : memberName.slice(0, 12);
        }

        return memberName;


    }, [event.members, settings, user]);


    let values: EventContextType = {
        event,
        updateEvent,
        eventData,
        expenses,
        expensesToShow,
        paginationData,
        applyFilters,
        clearFilters,
        filteredExpenses,
        filterQuery,
        isFiltering,
        filtersResultCount,
        filterPaginationData,
        toggleEventStatus,
        addMember,
        setMembers,
        deleteMember,
        deleteExpense,
        deleteMultiExpenses,
        updateMember,
        updateExpense,
        addExpense,
        loadMoreExpenses,
        fetchingMoreExpenses,
        creditors,
        debtors,
        transactions,
        showMemberName
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