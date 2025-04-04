import { create, StateCreator } from "zustand";
import { SavingsGoal } from '@/types/personal/savings-goal-types';
import { Transaction } from '@/types/personal/transaction-types';
import { InitData } from "@/types/responses/personal/init";
import { Category } from "@/types/personal/category-types";

export interface PersonalSlice {
    savingsGoals: SavingsGoal[];
    transactions: Transaction[];
    budget: number;
    categories: Category[]; // Added categories
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
}

export const createPersonalSlice: StateCreator<PersonalSlice, [], [], PersonalSlice> = (set) => ({
    savingsGoals: [], // Initialize savingsGoals
    transactions: [], // Initialize transactions
    budget: 0,
    categories: [], // Initialize categories
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
    setInitData: (data: InitData) => set(() => ({ savingsGoals: data.savings_goals, transactions: data.transactions, budget: data.budget, categories: data.categories })),
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
    setTransactions: (transactions: Transaction[]) => set(() => ({ transactions })),
    addTransaction: (transaction: Transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),
    removeTransaction: (id: number) => set((state) => ({ transactions: state.transactions.filter(transaction => transaction.id !== id) })),
    updateTransaction: (transaction: Transaction) => set((state) => {
        const index = state.transactions.findIndex(t => t.id === transaction.id);
        if (index !== -1) {
            const updatedTransactions = [...state.transactions];
            updatedTransactions[index] = transaction;
            return { transactions: updatedTransactions };
        }
        return state;
    }),
});