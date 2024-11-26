'use client'

import { CalendarCheck, CalendarClock, Filter, MoveRight, Plus, UserPlus, Zap } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import NewExpenseModal from "./NewExpenseModal";
import NewPersonModal from "./NewPersonModal";
import Expenses from "./Expenses/Expenses";
import { useEventStore } from "@/store/event-store";
import NoExpenses from "./Expenses/NoExpenses";
import NoGroupExpenses from "./Expenses/NoGroupExpenses";
import moment from "jalali-moment";
import Button from "@/components/Common/Button";
import { generateUID, TomanPriceFormatter } from "@/helpers/helpers";
import SettleHintsModal from "./SettleHintsModal";
import GroupMembers from "./GroupMembers";
import { Toast, useToastStore } from "@/store/toast-store";
import NoGroupMembers from "./NoGroupMembers";
import FiltersModal from "./FiltersModal";
import ActiveFilters from "./ActiveFilters";
import ShareEventLink from "./ShareEventLink";
import { EventContext } from "@/context/EventContext";

function Event() {

    const addToast = useToastStore(state => state.addToast)

    const {
        event,
        getAllCosts,
        getCostsCount,
        getTransfersCount,
        getMostCost,
        getHighestTransfer,
        getMaxPayer,
        getPersonBalance,
        getPersonBalanceStatus,
        transactions,
    } = useContext(EventContext);

    if (!event) return;

    const { activateEvent, deactivateEvent, activeFilters, filteredExpenses } = useEventStore(state => state);

    const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
    const [isNewPersonModalOpen, setIsNewPersonModalOpen] = useState(false);
    const [isSettleHintsModalOpen, setIsSettleHintsModalOpen] = useState(false);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

    function openNewExpenseModal() {
        if (event?.group.length === 0 || event?.status === 'inactive') return
        setIsNewExpenseModalOpen(true);
    }

    function closeNewExpenseModal() {
        setIsNewExpenseModalOpen(false);
    }

    function openNewPersonModal() {
        if (event?.status === 'inactive') return
        setIsNewPersonModalOpen(true);
    }

    function closeNewPersonModal() {
        setIsNewPersonModalOpen(false);
    }

    function toggleSettleHintsModal() {
        setIsSettleHintsModalOpen(prev => !prev);
    }

    function toggleFiltersModal() {
        setIsFiltersModalOpen(prev => !prev);
    }



    function toggleEventStatus() {

        if (!event) return;



        if (event.status === 'active') {
            let deactivateToast: Toast = {
                id: generateUID(),
                message: 'رویداد به پایان رسید',
                type: 'success'
            }
            deactivateEvent(event.id);
            addToast(deactivateToast)
        } else {
            let activateToast: Toast = {
                id: generateUID(),
                message: 'رویداد در جریان است',
                type: 'success'
            }
            activateEvent(event.id);
            addToast(activateToast)
        }
    }


    return (
        <div className="event_container">


            <aside className="col-span-1 lg:col-span-2 xl:col-span-1 border-l app_border_color flex flex-col">


                {event.group.length > 0 && (

                    <div className="p-3 flex flex-col gap-y-8 border-b app_border_color">
                        <div className="flex w-full justify-between items-center">
                            <h1 className="event_header_title">محاسبات</h1>
                            {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                        </div>

                        <ul className="flex flex-col gap-y-4">

                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400 font-semibold">مجموع هزینه ها</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getAllCosts().toString())} تومان</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد هزینه ها</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{getCostsCount()}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد جابجایی پول</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{getTransfersCount()}</span>
                            </div>

                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">بیشترین هزینه</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getMostCost().toString())} تومان</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">بیشترین جابجایی پول</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getHighestTransfer().toString())} تومان</span>
                            </div>



                        </ul>
                    </div>
                )}

                {event.group.length > 0 && (

                    <div className="p-3 flex flex-col gap-y-8 border-b app_border_color">
                        <div className="flex flex-row justify-between items-center">

                            <div className="flex w-full justify-between items-center">
                                <h1 className="event_header_title">سهم اعضا</h1>
                                {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                            </div>


                            <button onClick={toggleSettleHintsModal} className="flex flex-row flex-nowrap gap-x-2 items-center w-fit rounded-full px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-600">
                                <Zap className="size-4" />
                                <p className="text-[.7rem] font-semibold text-nowrap">
                                    راهنمای تسویه
                                </p>
                            </button>

                            {isSettleHintsModalOpen && (
                                <SettleHintsModal transactions={transactions} onClose={toggleSettleHintsModal} />
                            )}
                        </div>


                        <ul className="flex flex-col gap-y-4">

                            {event.group.map(person => (
                                <li key={person.id} className="flex w-full justify-between items-center">
                                    <div className="flex flex-row gap-x-2 justify-center items-center">
                                        <h1 className={`user_avatar_${person.scheme}_text`}>{person.name}</h1>
                                        {getPersonBalanceStatus(person.id) === 'طلبکار' && (
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-500">
                                                طلبکار
                                            </span>
                                        )}
                                        {getPersonBalanceStatus(person.id) === 'بدهکار' && (
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-500">
                                                بدهکار
                                            </span>
                                        )}
                                        {getPersonBalanceStatus(person.id) === 'تسویه' && (
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                                                تسویه
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(Math.abs(getPersonBalance(person.id)).toFixed(0))} تومان</span>
                                </li>
                            ))}


                        </ul>
                    </div>
                )}



                <div className="h-fit px-3 py-5 flex flex-col gap-y-8 border-b app_border_color">
                    <div className="flex w-full flex-row gap-x-2 items-center">
                        <h1 className="event_header_title">اعضای گروه</h1>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{`${event.group.length}  نفر`}</span>
                    </div>

                    {event.group.length > 0 ? (
                        <GroupMembers group={event.group} isEventDeleted={event.deletedAt !== null} />
                    ) : (
                        <NoGroupMembers eventStatus={event.status} isDeleted={event.deletedAt !== null} />
                    )}

                    {event.status === 'active' && event.deletedAt === null && (
                        <Button
                            text="افزودن عضو جدید"
                            color="gray"
                            onClick={openNewPersonModal}
                            size="small"
                            icon={<UserPlus className="size-4" />}
                        />
                    )}

                </div>

                <div className="px-3 py-5 flex flex-col gap-y-8">
                    <div className="flex w-full justify-between items-center">
                        <h1 className="event_header_title">اطلاعات رویداد</h1>
                        {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                    </div>

                    <ul className="flex flex-col gap-y-4">

                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400 font-semibold">وضعیت</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.status === 'active' ? 'درجریان' : 'به پایان رسیده'}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">برچسب</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.label}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">تاریخ شروع</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{moment(event.date).locale('fa').format("DD MMM، YYYY")}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد اعضا</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.group.length}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">مادرخرج</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{getMaxPayer().name || '-'}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">هزینه های مادرخرج</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getMaxPayer().amount.toFixed(0))} تومان</span>
                        </div>

                        <ShareEventLink />



                    </ul>

                    {event.deletedAt === null && (

                        <Button
                            text={event.status === 'active' ? 'پایان رویداد' : 'باز کردن رویداد'}
                            color={event.status === 'active' ? 'danger' : 'success'}
                            onClick={toggleEventStatus}
                            size="small"
                            icon={event.status === 'active' ? <CalendarCheck className="size-4" /> : <CalendarClock className="size-4" />}
                        />
                    )}

                </div>
            </aside>

            <div className="flex flex-col order-first lg:order-none border-b app_border_color lg:border-b-0 col-span-3 h-fit min-h-[400px] lg:min-h-[600px]">
                <div className="event_header_container z-50">

                    <div className="event_header_right">
                        <Link href={event.deletedAt === null ? '/dashboard/events' : '/dashboard/events/trash'} className="event_back_button">
                            <MoveRight className="event_back_button_icon" />
                        </Link>
                        <h1 className="event_header_title">{event.name}</h1>
                    </div>

                    {event.group.length > 0 && (
                        <div className="event_header_left">
                            {event.expenses.length > 0 && (
                                <Button
                                    text="فیلتر"
                                    color="gray"
                                    onClick={toggleFiltersModal}
                                    size="small"
                                    icon={<Filter className="size-4" />}
                                />
                            )}
                            {event.expenses.length > 0 && isFiltersModalOpen && <FiltersModal event={event} onClose={toggleFiltersModal} />}
                            {event.status === 'active' && event.deletedAt === null && (
                                <Button
                                    text="ثبت هزینه/جابجایی پول"
                                    color="accent"
                                    onClick={openNewExpenseModal}
                                    size="small"
                                    icon={<Plus className="size-4" />}
                                />
                            )}
                        </div>
                    )}

                    {activeFilters && (
                        <ActiveFilters />
                    )}

                </div>

                {(event.expenses.length > 0 && !activeFilters) || (activeFilters && filteredExpenses.length > 0) ? (
                    <Expenses expenses={activeFilters ? filteredExpenses : event.expenses} />
                ) : (event.deletedAt !== null || event.status === 'inactive' || (event.status === 'active' && event.group.length > 0)) ? <NoExpenses isFilterMode={!!activeFilters} isDeleted={event.deletedAt !== null} eventStatus={event.status} openNewExpenseModal={openNewExpenseModal} /> : (<NoGroupExpenses openNewPersonModal={openNewPersonModal} />)}


                {isNewExpenseModalOpen && <NewExpenseModal event={event} onClose={closeNewExpenseModal} />}
            </div>


            {isNewPersonModalOpen && <NewPersonModal onClose={closeNewPersonModal} />}

        </div>
    );
}

export default Event;