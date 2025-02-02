'use client'

import { CalendarCheck, CalendarClock, Filter, ListCheck, ListChecks, MoveRight, Plus, Trash, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import NewExpenseModal from "./NewExpenseModal";
import Expenses from "./Expenses/Expenses";
import NoExpenses from "./Expenses/NoExpenses";
import NoGroupExpenses from "./Expenses/NoGroupExpenses";
import moment from "jalali-moment";
import Button from "@/components/Common/Button";
import { TomanPriceFormatter } from "@/helpers/helpers";
import GroupMembers from "./GroupMembers";
import NoGroupMembers from "./NoGroupMembers";
import ActiveFilters from "./ActiveFilters";
import ShareEventLink from "./ShareEventLink";
import { EventContext } from "@/context/EventContext";
import NewMemberModal from "./NewMemberModal";
import { MultiSelectItemContext } from "@/context/MultiSelectItemContext";
import { deleteExpenseItemsReq } from "@/app/actions/event";
import MembersShare from "./MembersShare";
import NewFiltersModal from "./NewFiltersModal";
import useStore from "@/store/store";

function Event() {

    const { user, addToast, openDialog } = useStore()
    const { enableSelectMode, selectMode, disableSelectMode, selectAllItems, selectedItems } = useContext(MultiSelectItemContext);

    const {
        event,
        expenses,
        eventData,
        showMemberName,
        toggleEventStatus,
        transactions,
        deleteMultiExpenses,
        activeFilters, filteredExpenses
    } = useContext(EventContext);

    function onDeleteSelectedItems() {

        openDialog(
            'حذف موارد انتخابی',
            'آیا از حذف موارد انتخاب شده اطمینان دارید؟ درصورت حذف، داده ها قابل بازیابی نیستند.',
            {
                ok: {
                    text: 'حذف',
                    onClick: () => {
                        handleTrashExpenseItems()
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            }
        )

    }

    async function handleTrashExpenseItems() {
        const res = await deleteExpenseItemsReq(event.id, selectedItems)

        if (res.success) {
            deleteMultiExpenses(selectedItems)
            disableSelectMode()
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




    const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
    const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
    const [isSettleHintsModalOpen, setIsSettleHintsModalOpen] = useState(false);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

    const eventStatus = !event?.end_date ? 'active' : 'inactive';

    function openNewExpenseModal() {
        if (event?.members.length === 0 || eventStatus === 'inactive') return
        setIsNewExpenseModalOpen(true);
    }

    function closeNewExpenseModal() {
        setIsNewExpenseModalOpen(false);
    }

    function openNewMemberModal() {
        if (eventStatus === 'inactive') return
        setIsNewMemberModalOpen(true);
    }

    function closeNewMemberModal() {
        setIsNewMemberModalOpen(false);
    }

    function toggleSettleHintsModal() {
        setIsSettleHintsModalOpen(prev => !prev);
    }

    function toggleFiltersModal() {
        setIsFiltersModalOpen(prev => !prev);
    }

    const eventDays = moment().diff(moment(event.start_date), 'days') + 1;


    return (
        <div className="event_container">


            <aside className="col-span-1 lg:col-span-2 xl:col-span-1 border-l app_border_color flex flex-col">


                {event.members.length > 0 && (

                    <div className="p-3 flex flex-col gap-y-8 border-b app_border_color">
                        <div className="flex w-full justify-between items-center">
                            <h1 className="event_header_title">محاسبات</h1>
                            {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                        </div>

                        <ul className="flex flex-col gap-y-4">

                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400 font-semibold">مجموع هزینه ها</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(eventData.total_amount.toString())} تومان</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">میانگین هزینه در روز</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter((eventData.total_amount / eventDays).toFixed(0))} تومان</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد هزینه ها</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{eventData.expends_count}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">میانگین تعداد هزینه در روز</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{(eventData.expends_count / eventDays).toFixed(2)}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد جابجایی پول</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{eventData.transfers_count}</span>
                            </div>

                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">بیشترین هزینه</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(eventData.max_expend_amount.toString())} تومان</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <h1 className="text-sm text-gray-500 dark:text-gray-400">بیشترین جابجایی پول</h1>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(eventData.max_transfer_amount.toString())} تومان</span>
                            </div>



                        </ul>
                    </div>
                )}

                {event.members.length > 0 && (

                    <MembersShare members={event.members} toggleSettleHintsModal={toggleSettleHintsModal} isSettleHintsModalOpen={isSettleHintsModalOpen} transactions={transactions} />
                )}



                <div className="h-fit px-3 py-5 flex flex-col gap-y-8 border-b app_border_color">
                    <div className="flex w-full flex-row gap-x-2 items-center">
                        <h1 className="event_header_title">اعضای گروه</h1>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{`${event.members.length}  نفر`}</span>
                    </div>

                    {event.members.length > 0 ? (
                        <GroupMembers members={event.members} />
                    ) : (
                        <NoGroupMembers eventStatus={eventStatus} isDeleted={event.deleted_at !== null} />
                    )}

                    {eventStatus === 'active' && (
                        <Button
                            text="افزودن عضو جدید"
                            color="gray"
                            onClick={openNewMemberModal}
                            size="small"
                            icon={<UserPlus className="size-4" />}
                        />
                    )}

                </div>

                <div className="sticky top-20 px-3 py-5 flex flex-col gap-y-8">
                    <div className="flex w-full justify-between items-center">
                        <h1 className="event_header_title">اطلاعات رویداد</h1>
                        {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                    </div>

                    <ul className="flex flex-col gap-y-4">

                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400 font-semibold">وضعیت</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{eventStatus === 'active' ? 'درجریان' : 'به پایان رسیده'}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">برچسب</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.label}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">تاریخ شروع</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{moment(event.start_date).locale('fa').format("DD MMM، YYYY")}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">تاریخ امروز</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{moment().locale('fa').format("DD MMM، YYYY")}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">طول رویداد</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{eventDays} روز</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد اعضا</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.members.length}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">مادرخرج</h1>
                            {!user ? (
                                <span className="h-5 w-10 bg-gray-400 dark:bg-gray-600 opacity-50 rounded-md animate-pulse"></span>
                            ) : (

                                <span className="text-sm text-gray-500 dark:text-gray-400">{eventData.treasurer ? showMemberName(eventData.treasurer.member.id) : '-'}</span>
                            )}
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">هزینه های مادرخرج</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{eventData.treasurer ? TomanPriceFormatter(eventData.treasurer.amount.toString()) : '-'} تومان</span>
                        </div>

                        <ShareEventLink />



                    </ul>

                    {event.deleted_at === null && (

                        <Button
                            text={eventStatus === 'active' ? 'پایان رویداد' : 'باز کردن رویداد'}
                            color={eventStatus === 'active' ? 'danger' : 'success'}
                            onClick={toggleEventStatus}
                            size="small"
                            icon={eventStatus === 'active' ? <CalendarCheck className="size-4" /> : <CalendarClock className="size-4" />}
                        />
                    )}

                </div>
            </aside>

            <div className="flex flex-col order-first lg:order-none border-b app_border_color lg:border-b-0 col-span-3 h-fit min-h-[400px] lg:min-h-[600px]">

                <div className="event_header_container ">

                    <div className="event_header_right">
                        <Link href={event.deleted_at === null ? '/dashboard/events' : '/dashboard/events/trash'} className="event_back_button">
                            <MoveRight className="event_back_button_icon" />
                        </Link>
                        <h1 className="event_header_title">{event.name}</h1>
                    </div>

                    {event.members.length > 0 && (

                        <div className="event_header_left">
                            {selectMode && (
                                <>
                                    {selectedItems.length > 0 && (

                                        <Button
                                            text={"حذف" + `${selectedItems.length > 0 ? " (" + selectedItems.length + ")" : ''}`}
                                            color="danger"
                                            onClick={onDeleteSelectedItems}
                                            size="small"
                                            icon={<Trash className="size-5" />}
                                        />
                                    )}
                                    <Button
                                        text="انتخاب همه"
                                        color="accent"
                                        onClick={() => selectAllItems(expenses.map(e => e.id.toString()))}
                                        size="small"
                                        icon={<ListCheck className="size-5" />}
                                    />
                                </>
                            )}

                            {!selectMode && expenses.length > 0 && (
                                <Button
                                    text="فیلتر"
                                    color="gray"
                                    onClick={toggleFiltersModal}
                                    size="small"
                                    icon={<Filter className="size-4" />}
                                />
                            )}

                            {!selectMode && expenses.length > 0 && isFiltersModalOpen && <NewFiltersModal event={event} onClose={toggleFiltersModal} />}

                            {!selectMode && eventStatus === 'active' && event.deleted_at === null && (
                                <Button
                                    text="ثبت هزینه/جابجایی پول"
                                    color="accent"
                                    onClick={openNewExpenseModal}
                                    size="small"
                                    icon={<Plus className="size-4" />}
                                />
                            )}
                            {expenses.length > 0 && (
                                <Button
                                    text=""
                                    color="accent"
                                    onClick={selectMode ? disableSelectMode : enableSelectMode}
                                    size="small"
                                    icon={selectMode ? <X className='size-5' /> : <ListChecks className="size-5" />}
                                />
                            )}
                        </div>

                    )}

                    {activeFilters && (
                        <ActiveFilters />
                    )}

                </div>

                {/* <Expenses expenses={expenses} /> */}

                {(expenses.length > 0 && !activeFilters) || (activeFilters && filteredExpenses.length > 0) ? (
                    <Expenses expenses={activeFilters ? filteredExpenses : expenses} />
                ) : (event.deleted_at !== null || eventStatus === 'inactive' || (eventStatus === 'active' && event.members.length > 0)) ? <NoExpenses isFilterMode={!!activeFilters} isDeleted={event.deleted_at !== null} eventStatus={eventStatus} openNewExpenseModal={openNewExpenseModal} /> : (<NoGroupExpenses openNewMemberModal={openNewMemberModal} />)}


                {isNewExpenseModalOpen && <NewExpenseModal event={event} onClose={closeNewExpenseModal} />}
            </div>


            {isNewMemberModalOpen && <NewMemberModal onClose={closeNewMemberModal} />}

        </div>
    );
}

export default Event;