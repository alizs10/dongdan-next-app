import { create, StateCreator } from "zustand";
import { SavingsGoal } from '@/types/personal/savings-goal-types';
import { Transaction } from '@/types/personal/transaction-types';
import { InitData } from "@/types/responses/personal/init";
import { Category } from "@/types/personal/category-types";
import { BudgetLimit } from "@/types/personal/limit-types";

export interface TransactionFilter {
    minDate?: Date;
    maxDate?: Date;
    categoryIds?: number[];
    type?: 'all' | 'income' | 'expense';
}

export interface PersonalSlice {
    savingsGoals: SavingsGoal[];
    transactions: Transaction[];
    activeFilters: TransactionFilter;
    transactionsForView: Transaction[];
    budget: number;
    categories: Category[]; // Added categories
    budgetLimits: BudgetLimit[]; // Added budgetLimits
    setBudget: (budget: number) => void; // Added setBudget
    addCategory: (category: Category) => void; // Added addCategory
    removeCategory: (category: Category) => void; // Added removeCategory
    updateCategory: (category: Category) => void; // Added updateCategory
    addSavingsGoal: (goal: SavingsGoal) => void;
    removeSavingsGoal: (id: number) => void;
    updateSavingsGoal: (goal: SavingsGoal) => void;
    setTransactions: (transactions: Transaction[]) => void;
    addTransaction: (transaction: Transaction) => void;
    removeTransaction: (id: number) => void;
    updateTransaction: (transaction: Transaction) => void; // Added updateTransaction
    setInitData: (data: InitData) => void; // Added setInitData to types
    filterTransactions: (filter: TransactionFilter) => Transaction[]; // Added filterTransactions
    setActiveFilters: (filters: TransactionFilter) => void; // Added setActiveFilters
    // Added budget limit functions
    addBudgetLimit: (limit: BudgetLimit) => void;
    removeBudgetLimit: (id: number) => void;
    updateBudgetLimit: (limit: BudgetLimit) => void;
}

export const createPersonalSlice: StateCreator<PersonalSlice, [], [], PersonalSlice> = (set, get) => ({
    savingsGoals: [], // Initialize savingsGoals
    transactions: [], // Initialize transactions
    activeFilters: { type: 'all' }, // Initialize with default filters
    transactionsForView: [], // Initialize empty, will be populated by filterTransactions
    budget: 0,
    categories: [], // Initialize categories
    budgetLimits: [], // Initialize budgetLimits
    setBudget: (budget: number) => set(() => ({ budget })), // Implement setBudget
    addCategory: (category: Category) => set((state) => ({ categories: [...state.categories, category] })), // Implement addCategory
    removeCategory: (category: Category) => set((state) => ({ categories: state.categories.filter(cat => cat !== category) })), // Implement removeCategory
    updateCategory: (category: Category) => set((state) => {
        const index = state.categories.findIndex(cat => cat.id === category.id);
        if (index !== -1) {
            const updatedCategories = [...state.categories];
            updatedCategories[index] = category;
            return { categories: updatedCategories };
        }
        return state;
    }),
    setInitData: (data: InitData) => set(() => ({
        savingsGoals: data.savings_goals,
        transactions: data.transactions,
        transactionsForView: data.transactions,
        budget: data.budget,
        categories: data.categories,
        budgetLimits: data.limits || [] // Changed from budget_limits to limits
    })),
    addSavingsGoal: (goal: SavingsGoal) => set((state) => ({ savingsGoals: [...state.savingsGoals, goal] })),
    removeSavingsGoal: (id: number) => set((state) => ({ savingsGoals: state.savingsGoals.filter(goal => goal.id !== id) })),
    updateSavingsGoal: (goal: SavingsGoal) => set((state) => {
        const index = state.savingsGoals.findIndex(g => g.id === goal.id);
        if (index !== -1) {
            const updatedGoals = [...state.savingsGoals];
            updatedGoals[index] = goal;
            return { savingsGoals: updatedGoals };
        }
        return state;
    }),
    setTransactions: (transactions: Transaction[]) => set((state) => {
        const transactionsForView = filterTransactionsHelper(transactions, state.activeFilters);
        return { transactions, transactionsForView };
    }),
    addTransaction: (transaction: Transaction) => set((state) => {
        const newTransactions = [...state.transactions, transaction];
        const transactionsForView = filterTransactionsHelper(newTransactions, state.activeFilters);
        return { transactions: newTransactions, transactionsForView };
    }),
    removeTransaction: (id: number) => set((state) => {
        const newTransactions = state.transactions.filter(transaction => transaction.id !== id);
        const transactionsForView = filterTransactionsHelper(newTransactions, state.activeFilters);
        return { transactions: newTransactions, transactionsForView };
    }),
    updateTransaction: (transaction: Transaction) => set((state) => {
        const index = state.transactions.findIndex(t => t.id === transaction.id);
        if (index !== -1) {
            const updatedTransactions = [...state.transactions];
            updatedTransactions[index] = transaction;
            const transactionsForView = filterTransactionsHelper(updatedTransactions, state.activeFilters);
            return { transactions: updatedTransactions, transactionsForView };
        }
        return state;
    }),
    filterTransactions: (filter: TransactionFilter) => {
        const { transactions } = get();
        return filterTransactionsHelper(transactions, filter);
    },
    setActiveFilters: (filters: TransactionFilter) => set((state) => {
        const transactionsForView = filterTransactionsHelper(state.transactions, filters);
        return { activeFilters: filters, transactionsForView };
    }),
    // Added budget limit functions
    addBudgetLimit: (limit: BudgetLimit) => set((state) => ({
        budgetLimits: [...state.budgetLimits, limit]
    })),
    removeBudgetLimit: (id: number) => set((state) => ({
        budgetLimits: state.budgetLimits.filter(limit => limit.id !== id)
    })),
    updateBudgetLimit: (limit: BudgetLimit) => set((state) => {
        const index = state.budgetLimits.findIndex(l => l.id === limit.id);
        if (index !== -1) {
            const updatedLimits = [...state.budgetLimits];
            updatedLimits[index] = limit;
            return { budgetLimits: updatedLimits };
        }
        return state;
    }),
});

// Helper function to avoid code duplication
const filterTransactionsHelper = (transactions: Transaction[], filter: TransactionFilter): Transaction[] => {
    return transactions.filter(transaction => {
        // Filter by date range
        if (filter.minDate && new Date(transaction.date) < filter.minDate) return false;
        if (filter.maxDate && new Date(transaction.date) > filter.maxDate) return false;

        // Filter by category
        if (filter.categoryIds && filter.categoryIds.length > 0) {
            const category_ids = transaction.categories?.map(cat => cat.id)
            if (!category_ids || !category_ids.some(id => filter.categoryIds?.includes(id))) return false;
        }

        // Filter by transaction type
        if (filter.type && filter.type !== 'all') {
            if (filter.type !== transaction.type) return false;
            // if (filter.type === 'expense') return false;
        }

        return true;
    });
};