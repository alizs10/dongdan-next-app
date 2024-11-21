import { type ExpenseFilters } from "@/types/event-types";
import styles from '../../../styles/dashboard/dashboard-styles.module.css';
import Button from "@/components/Common/Button";
import { Banknote, CalendarRange, CreditCard, DollarSign, FilterX, User, UserMinus, UserPlus, Users } from "lucide-react";
import { useEventStore } from "@/store/event-store";
import moment from "jalali-moment";

function ActiveFilters() {

    const { activeFilters, clearFilters } = useEventStore(state => state);

    return (
        <section className="w-full flex flex-col gap-y-2 py-3">
            <div className="flex flex-row justify-between items-center">
                <div className={styles.header_right}>
                    <h2 className={styles.header_title}>فیلتر های اعمال شده</h2>
                </div>
                <div className={styles.header_left}>
                    <Button
                        text="حذف فیلتر ها"
                        color="danger"
                        onClick={clearFilters}
                        size="small"
                        icon={<FilterX className="size-4" />}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2">


                <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">

                    {activeFilters?.type === 'expend' ? (
                        <DollarSign className="size-4" />
                    ) : activeFilters?.type === 'transfer' ? (
                        <Banknote className="size-4" />
                    ) : null}
                    <span>{activeFilters?.type === 'any' ? 'همه' : activeFilters?.type === 'expend' ? 'فقط هزینه ها' : 'فقط جابجایی های پول'}</span>

                </div>
                <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                    <CalendarRange className="size-4" />
                    <span>از تاریخ</span>
                    <span>{moment(activeFilters?.dateRange[0]).locale('fa').format("YYYY/MM/DD")}</span>
                    <span>تا</span>
                    <span>{moment(activeFilters?.dateRange[1]).locale('fa').format("YYYY/MM/DD")}</span>
                </div>
                <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                    <Banknote className="size-4" />
                    <span>از</span>
                    <span>{activeFilters?.amountMin}</span>
                    <span>تا</span>
                    <span>{activeFilters?.amountMax}</span>
                    <span>تومان</span>
                </div>

                {activeFilters?.type === 'expend' && activeFilters?.payer && activeFilters?.payer.length > 0 && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <CreditCard className="size-4" />
                        <span>پرداخت کننده</span>
                    </div>
                )}
                {activeFilters?.type === 'expend' && activeFilters?.group && activeFilters?.group.length > 0 && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <Users className="size-4" />
                        <span>کی سهیم بوده</span>
                    </div>
                )}

                {activeFilters?.type === 'transfer' && activeFilters?.from && activeFilters?.from.length > 0 && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <UserMinus className="size-4" />
                        <span>مبداء</span>
                    </div>
                )}

                {activeFilters?.type === 'transfer' && activeFilters?.to && activeFilters?.to.length > 0 && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <UserPlus className="size-4" />
                        <span>مقصد</span>
                    </div>
                )}


            </div>
        </section>
    );
}

export default ActiveFilters;