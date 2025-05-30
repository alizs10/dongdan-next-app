'use client';

import { createContext, useCallback, useMemo, useState } from "react";
// import { TomanPriceFormatter } from "@/helpers/helpers";
// import useStore from "@/store/store";
import { NewTransactionFormInputs } from "@/components/Dashboard/Personal/Modals/NewTransactionsModal";



export type PersonalContextType = {
    initTransaction: NewTransactionFormInputs | null;
    setInitTransaction: (transaction: NewTransactionFormInputs | null) => void;
    newTransactionModalVis: boolean;
    openNewTransactionModal: () => void;
    closeNewTransactionModal: () => void;
}

const PersonalContextInit = {
    initTransaction: null,
    setInitTransaction: (transaction: NewTransactionFormInputs | null) => { },
    newTransactionModalVis: false,
    openNewTransactionModal: () => { },
    closeNewTransactionModal: () => { },
}


export const PersonalContext = createContext<PersonalContextType>(PersonalContextInit);

export function PersonalContextProvider({ children }: { children: React.ReactNode }) {

    const [initTransaction, setInitTransaction] = useState<NewTransactionFormInputs | null>(null)
    const [newTransactionModalVis, setNewTransactionModalVis] = useState(false)

    function closeNewTransactionModal() {
        setNewTransactionModalVis(false)
        setInitTransaction(null)
    }

    function openNewTransactionModal() {
        setNewTransactionModalVis(true)
    }


    let values: PersonalContextType = {
        initTransaction,
        setInitTransaction,
        newTransactionModalVis,
        openNewTransactionModal,
        closeNewTransactionModal
    }

    return (
        <PersonalContext.Provider value={values}>
            {children}
        </PersonalContext.Provider>
    )
}