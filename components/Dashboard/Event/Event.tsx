'use client'

import { CalendarCheck, CalendarClock, Filter, ListCheck, ListChecks, MoveRight, Plus, Trash, UserPlus, X, Zap } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import NewExpenseModal from "./NewExpenseModal";
import Expenses from "./Expenses/Expenses";
import NoExpenses from "./Expenses/NoExpenses";
import NoGroupExpenses from "./Expenses/NoGroupExpenses";
import moment from "jalali-moment";
import Button from "@/components/Common/Button";
import { TomanPriceFormatter } from "@/helpers/helpers";
import SettleHintsModal from "./SettleHintsModal";
import GroupMembers from "./GroupMembers";
import NoGroupMembers from "./NoGroupMembers";
import FiltersModal from "./FiltersModal";
import ActiveFilters from "./ActiveFilters";
import ShareEventLink from "./ShareEventLink";
import { EventContext } from "@/context/EventContext";
import { useAppStore } from "@/store/app-store";
import NewMemberModal from "./NewMemberModal";
import { MultiSelectItemContext } from "@/context/MultiSelectItemContext";
import { useDialogStore } from "@/store/dialog-store";
import { useToastStore } from "@/store/toast-store";
import { deleteExpenseItemsReq } from "@/app/actions/event";

function Event() {

    const { user, settings } = useAppStore(state => state)
    const { enableSelectMode, selectMode, disableSelectMode, selectAllItems, selectedItems } = useContext(MultiSelectItemContext);

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
        toggleEventStatus,
        transactions,
        deleteMultiExpenses,
        activeFilters, filteredExpenses
    } = useContext(EventContext);

    const addToast = useToastStore(state => state.addToast)
    const openDialog = useDialogStore(state => state.openDialog)

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

                {event.members.length > 0 && (

                    <div className="p-3 flex flex-col gap-y-8 border-b app_border_color">
                        <div className="flex flex-row justify-between items-center">

                            <div className="flex w-full justify-between items-center">
                                <h1 className="event_header_title">سهم اعضا</h1>
                                {/* <span className="text-sm text-gray-500 dark:text-gray-400">8 نفر</span> */}
                            </div>


                            <button onClick={toggleSettleHintsModal} className="flex flex-row flex-nowrap gap-x-2 items-center w-fit rounded-full px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-600">
                                <Zap className="size-4" />
                                <p className="text-[.7rem] font-semibold text-nowrap">
                                    تسویه حساب سریع
                                </p>
                            </button>

                            {isSettleHintsModalOpen && (
                                <SettleHintsModal transactions={transactions} onClose={toggleSettleHintsModal} />
                            )}
                        </div>


                        <ul className="flex flex-col gap-y-4">

                            {event.members.map(person => (
                                <li key={person.id} className="flex w-full justify-between items-center">
                                    <div className="flex flex-row gap-x-2 justify-center items-center">
                                        <h1 className={`user_avatar_${person.scheme}_text`}>{person?.member_id === user?.id ? settings.show_as_me ? 'خودم' : user?.name : person.name}</h1>
                                        {getPersonBalanceStatus(person.id.toString()) === 'طلبکار' && (
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-500">
                                                طلبکار
                                            </span>
                                        )}
                                        {getPersonBalanceStatus(person.id.toString()) === 'بدهکار' && (
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-500">
                                                بدهکار
                                            </span>
                                        )}
                                        {getPersonBalanceStatus(person.id.toString()) === 'تسویه' && (
                                            <span className="text-[.6rem] rounded-full px-2 py-1 bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                                                تسویه
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(Math.abs(getPersonBalance(person.id.toString())).toString())} تومان</span>
                                </li>
                            ))}


                        </ul>
                    </div>
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

                <div className="px-3 py-5 flex flex-col gap-y-8">
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
                            <span className="text-sm text-gray-500 dark:text-gray-400">{moment().diff(moment(event.start_date), 'days') + 1} روز</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">تعداد اعضا</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.members.length}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">مادرخرج</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{getMaxPayer().name || '-'}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-sm text-gray-500 dark:text-gray-400">هزینه های مادرخرج</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{TomanPriceFormatter(getMaxPayer().amount.toString())} تومان</span>
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
                <div className="event_header_container z-50">

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
                                        onClick={() => selectAllItems(event.expenses.map(e => e.id.toString()))}
                                        size="small"
                                        icon={<ListCheck className="size-5" />}
                                    />
                                </>
                            )}

                            {!selectMode && event.expenses.length > 0 && (
                                <Button
                                    text="فیلتر"
                                    color="gray"
                                    onClick={toggleFiltersModal}
                                    size="small"
                                    icon={<Filter className="size-4" />}
                                />
                            )}

                            {!selectMode && event.expenses.length > 0 && isFiltersModalOpen && <FiltersModal event={event} onClose={toggleFiltersModal} />}
                            {!selectMode && eventStatus === 'active' && event.deleted_at === null && (
                                <Button
                                    text="ثبت هزینه/جابجایی پول"
                                    color="accent"
                                    onClick={openNewExpenseModal}
                                    size="small"
                                    icon={<Plus className="size-4" />}
                                />
                            )}
                            {event.expenses.length > 0 && (
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

                {/* <Expenses expenses={event.expenses} /> */}

                {(event.expenses.length > 0 && !activeFilters) || (activeFilters && filteredExpenses.length > 0) ? (
                    <Expenses expenses={activeFilters ? filteredExpenses : event.expenses} />
                ) : (event.deleted_at !== null || eventStatus === 'inactive' || (eventStatus === 'active' && event.members.length > 0)) ? <NoExpenses isFilterMode={!!activeFilters} isDeleted={event.deleted_at !== null} eventStatus={eventStatus} openNewExpenseModal={openNewExpenseModal} /> : (<NoGroupExpenses openNewMemberModal={openNewMemberModal} />)}


                {isNewExpenseModalOpen && <NewExpenseModal event={event} onClose={closeNewExpenseModal} />}
            </div>


            {isNewMemberModalOpen && <NewMemberModal onClose={closeNewMemberModal} />}

        </div>
    );
}

export default Event;