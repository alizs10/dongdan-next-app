'use client'

import { MoveRight, NotebookPen, ReceiptText, User, UserPlus } from "lucide-react";
import styles from "./Event.module.css";
import Link from "next/link";
import { useState } from "react";
import NewExpenseModal from "./NewExpenseModal";

function Event() {

    const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);

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

                        <button onClick={openNewExpenseModal} className="flex gap-x-2 items-center px-4 py-2 rounded-xl bg-violet-100 text-violet-900 mt-2">
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
                        <li className="flex flex-row gap-x-4 items-center">
                            <div className="p-2 border border-blue-800 bg-blue-100 rounded-full">
                                <User className="size-5 text-blue-800" />
                            </div>

                            <span className="text-base text-blue-800">محمدحسین</span>
                        </li>
                        <li className="flex flex-row gap-x-4 items-center">
                            <div className="p-2 border border-emerald-800 bg-emerald-100 rounded-full">
                                <User className="size-5 text-emerald-800" />
                            </div>

                            <span className="text-base text-emerald-800">میلاد</span>
                        </li>
                        <li className="flex flex-row gap-x-4 items-center">
                            <div className="p-2 border border-red-800 bg-red-100 rounded-full">
                                <User className="size-5 text-red-800" />
                            </div>

                            <span className="text-base text-red-800">رضا</span>
                        </li>
                        <li className="flex flex-row gap-x-4 items-center">
                            <div className="p-2 border border-purple-800 bg-purple-100 rounded-full">
                                <User className="size-5 text-purple-800" />
                            </div>

                            <span className="text-base text-purple-800">محمدقادر</span>
                        </li>
                        <li className="flex flex-row gap-x-4 items-center">
                            <div className="p-2 border border-gray-800 bg-gray-100 rounded-full">
                                <User className="size-5 text-gray-800" />
                            </div>

                            <span className="text-base text-gray-800">علی</span>
                        </li>
                        <li className="flex flex-row gap-x-4 items-center">
                            <div className="p-2 border border-yellow-800 bg-yellow-100 rounded-full">
                                <User className="size-5 text-yellow-800" />
                            </div>

                            <span className="text-base text-yellow-800">حامد</span>
                        </li>
                        <li className="flex flex-row gap-x-4 items-center">
                            <div className="p-2 border border-green-800 bg-green-100 rounded-full">
                                <User className="size-5 text-green-800" />
                            </div>

                            <span className="text-base text-green-800">محمدامین</span>
                        </li>
                        <li className="flex flex-row gap-x-4 items-center">
                            <div className="p-2 border border-pink-800 bg-pink-100 rounded-full">
                                <User className="size-5 text-pink-800" />
                            </div>

                            <span className="text-base text-pink-800">ابوالفضل</span>
                        </li>
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