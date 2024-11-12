'use client'

import { Filter, MoveRight, NotebookPen, Plus, ReceiptText, User, UserPlus, Zap } from "lucide-react";
import styles from "./Event.module.css";
import Link from "next/link";
import { useState } from "react";
import NewExpenseModal from "./NewExpenseModal";
import NewPersonModal from "./NewPersonModal";
import Expenses from "./Expenses/Expenses";

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

    function openNewPersonModal() {
        setIsNewPersonModalOpen(true);
    }

    function closeNewPersonModal() {
        setIsNewPersonModalOpen(false);
    }

    return (
        <div className={styles.event_container}>
            <div className={styles.header_container}>

                <div className={styles.header_right}>
                    <Link href={'/dashboard'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>سفر شمال</h1>
                </div>

                <div className={styles.header_left}>

                    <button className="flex gap-x-2 items-center px-5 py-2 rounded-xl bg-gray-100 text-gray-700">
                        <Filter className="size-3.5" />
                        <span className="text-sm">فیلتر</span>
                    </button>
                    <button onClick={openNewExpenseModal} className="flex gap-x-2 items-center px-5 py-2 rounded-xl bg-indigo-50 text-indigo-900">
                        <Plus className="size-3.5" />
                        <span className="text-sm">افزودن هزینه</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4">

                <div className="col-span-3">

                    <Expenses />

                    <div className="hidden w-full h-full justify-center items-center flex-col gap-y-4">
                        <ReceiptText className="size-64 text-gray-300" />
                        <span className="text-base text-gray-500">هنوز کسی هزینه ای نکرده...</span>

                        <button onClick={openNewExpenseModal} className="flex gap-x-2 items-center px-5 py-2 rounded-xl bg-indigo-50 text-indigo-900 mt-2">
                            <NotebookPen className="size-5" />
                            <span>افزودن هزینه</span>
                        </button>
                    </div>

                    {isNewExpenseModalOpen && <NewExpenseModal onClose={closeNewExpenseModal} />}
                </div>

                <aside className="col-span-1 border-r border-gray-200 flex flex-col-reverse">

                    <div className="p-3 flex flex-col gap-y-8">
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

                        <button onClick={openNewPersonModal} className="flex gap-x-2 text-sm justify-center text-gray-700 bg-gray-200 rounded-xl py-3">
                            <UserPlus className="size-5" />
                            <span>افزودن عضو جدید</span>
                        </button>
                    </div>


                    <div className="p-3 flex flex-col gap-y-8 border-b border-gray-200">
                        <div className="flex flex-row justify-between items-center">

                            <div className="flex w-full justify-between items-center">
                                <h1 className={styles.header_title}>سهم اعضا</h1>
                                {/* <span className="text-sm text-gray-500">8 نفر</span> */}
                            </div>


                            <button className="flex flex-row flex-nowrap gap-x-2 items-center w-fit rounded-full px-3 py-1.5 bg-indigo-50 text-indigo-700">
                                <Zap className="size-4" />
                                <p className="text-[.7rem] font-semibold text-nowrap">
                                    راهنمای تسویه
                                </p>
                            </button>
                        </div>


                        <ul className="flex flex-col gap-y-4">

                            {group.map(person => (
                                <li key={person.id} className="flex w-full justify-between items-center">
                                    <div className="flex flex-row gap-x-2 justify-center items-center">
                                        <h1 className={`user_avatar_${person.scheme}_text`}>{person.name}</h1>
                                        <span className="text-[.6rem] font-semibold rounded-full px-2 py-1 bg-red-100 text-red-600">
                                            بدهکار
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">100000 تومان</span>
                                </li>
                            ))}


                        </ul>
                    </div>

                    <div className="p-3 flex flex-col gap-y-8 border-b border-gray-200">
                        <div className="flex w-full justify-between items-center">
                            <h1 className={styles.header_title}>محاسبات</h1>
                            {/* <span className="text-sm text-gray-500">8 نفر</span> */}
                        </div>

                        <ul className="flex flex-col gap-y-4">

                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 font-semibold">مجموع هزینه ها</h1>
                                <span className="text-sm text-gray-500">2200500 تومان</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">تعداد هزینه ها</h1>
                                <span className="text-sm text-gray-500">12</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">تعداد جابجایی پول</h1>
                                <span className="text-sm text-gray-500">7</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">تعداد اعضا</h1>
                                <span className="text-sm text-gray-500">8</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">بیشترین هزینه</h1>
                                <span className="text-sm text-gray-500">800000</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">بیشترین جابجایی پول</h1>
                                <span className="text-sm text-gray-500">1200000</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500">مادرخرج</h1>
                                <span className="text-sm text-gray-500">علی</span>
                            </div>


                        </ul>
                    </div>

                </aside>

                {isNewPersonModalOpen && <NewPersonModal onClose={closeNewPersonModal} />}
            </div>

        </div>
    );
}

export default Event;