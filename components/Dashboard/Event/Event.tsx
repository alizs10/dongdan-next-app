'use client'

import { MoveRight, NotebookPen, ReceiptText, User, UserPlus } from "lucide-react";
import styles from "./Event.module.css";
import Link from "next/link";
import { useState } from "react";
import NewExpenseModal from "./NewExpenseModal";

const group = [
    {
        id: 'p1',
        name: 'علی',
        scheme: 'gray'
    },
    {
        id: 'p2',
        name: 'محمدحسین',
        scheme: 'rose'
    },
    {
        id: 'p3',
        name: 'میلاد',
        scheme: 'orange'
    },
    {
        id: 'p4',
        name: 'محمدقادر',
        scheme: 'green'
    },
    {
        id: 'p5',
        name: 'رضا',
        scheme: 'yellow'
    },
    {
        id: 'p6',
        name: 'ابوالفضل',
        scheme: 'blue'
    },
    {
        id: 'p7',
        name: 'حامد',
        scheme: 'purple'
    },
    {
        id: 'p8',
        name: 'علیرضا',
        scheme: 'red'
    },
]

function Event() {

    const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
    const [isNewPersonModalOpen, setIsNewPersonModalOpen] = useState(false);

    function openNewExpenseModal() {
        setIsNewExpenseModalOpen(true);
    }

    function closeNewExpenseModal() {
        setIsNewExpenseModalOpen(false);
    }

    return (
        <div className={styles.event_container}>
            <div className={styles.header_container}>
                <Link href={'/dashboard'} className={styles.back_button}>
                    <MoveRight className={styles.back_button_icon} />
                </Link>
                <h1 className={styles.header_title}>سفر شمال</h1>
            </div>

            <div className="grid grid-cols-4">

                <div className="col-span-3">
                    <div className="w-full h-full flex justify-center items-center flex-col gap-y-4">
                        <ReceiptText className="size-64 text-gray-300" />
                        <span className="text-base text-gray-500">هنوز کسی هزینه ای نکرده...</span>

                        <button onClick={openNewExpenseModal} className="flex gap-x-2 items-center px-4 py-2 rounded-xl bg-indigo-100 text-indigo-900 mt-2">
                            <NotebookPen className="size-5" />
                            <span>افزودن هزینه</span>
                        </button>
                    </div>

                    {isNewExpenseModalOpen && <NewExpenseModal onClose={closeNewExpenseModal} />}
                </div>

                <aside className="p-3 col-span-1 border-r border-gray-200 flex flex-col gap-y-8">
                    <div className="flex w-full justify-between items-center">
                        <h1 className={styles.header_title}>اعضای گروه</h1>
                        <span className="text-sm text-gray-500">8 نفر</span>
                    </div>

                    <ul className="flex flex-col gap-y-4">

                        {group.map(user => (
                            <li key={user.id} className="flex flex-row gap-x-4 items-center">
                                <div className={`p-2 border user_avatar_${user.scheme}_border user_avatar_${user.scheme}_bg rounded-full`}>
                                    <User className={`size-5 user_avatar_${user.scheme}_text`} />
                                </div>
                                <span className={`text-base user_avatar_${user.scheme}_text`}>{user.name}</span>
                            </li>
                        ))}

                    </ul>

                    <button className="flex gap-x-2 text-sm justify-center text-gray-700 bg-gray-200 rounded-xl py-3">
                        <UserPlus className="size-5" />
                        <span>افزودن عضو جدید</span>
                    </button>
                </aside>
            </div>

        </div>
    );
}

export default Event;