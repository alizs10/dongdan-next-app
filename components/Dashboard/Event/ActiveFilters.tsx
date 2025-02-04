import Button from "@/components/Common/Button";
import { Banknote, CalendarRange, CreditCard, DollarSign, FilterX, UserMinus, UserPlus, Users } from "lucide-react";
import moment from "jalali-moment";
import { useContext } from "react";
import { EventContext } from "@/context/EventContext";

function ActiveFilters() {

    const { filterQuery, clearFilters } = useContext(EventContext);

    const searchParams = new URLSearchParams(filterQuery);

    const activeFilters = {
        type: searchParams.get('type') || 'any',
        amountMin: searchParams.get('min_amount') || '0',
        amountMax: searchParams.get('max_amount') || '0',
        payer_id: searchParams.get('payer_id') || '',
        contributor_ids: searchParams.get('contributor_ids')?.split(',') || [],
        dateRange: [
            searchParams.get('start_date') ? new Date(searchParams.get('start_date')!) : null,
            searchParams.get('end_date') ? new Date(searchParams.get('end_date')!) : null
        ],
        transmitter_id: searchParams.get('transmitter_id') || '',
        receiver_id: searchParams.get('receiver_id') || ''
    }


    return (
        <section className="w-full flex flex-col gap-y-2 py-3">
            <div className="flex flex-row justify-between items-center">
                <div className="event_header_right">
                    <h2 className="event_header_title">فیلتر های اعمال شده</h2>
                </div>
                <div className="event_header_left">
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

                {activeFilters?.dateRange[0] && activeFilters?.dateRange[1] && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <CalendarRange className="size-4" />
                        <span>از تاریخ</span>
                        <span>{moment(activeFilters?.dateRange[0]).locale('fa').format("YYYY/MM/DD")}</span>
                        <span>تا</span>
                        <span>{moment(activeFilters?.dateRange[1]).locale('fa').format("YYYY/MM/DD")}</span>
                    </div>
                )}

                {+activeFilters?.amountMax > 0 && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <Banknote className="size-4" />
                        <span>از</span>
                        <span>{activeFilters?.amountMin}</span>
                        <span>تا</span>
                        <span>{activeFilters?.amountMax}</span>
                        <span>تومان</span>
                    </div>
                )}


                {activeFilters?.type === 'expend' && activeFilters?.payer_id && activeFilters?.payer_id.length > 0 && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <CreditCard className="size-4" />
                        <span>پرداخت کننده</span>
                    </div>
                )}
                {activeFilters?.type === 'expend' && activeFilters?.contributor_ids && activeFilters?.contributor_ids.length > 0 && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <Users className="size-4" />
                        <span>کی سهیم بوده</span>
                    </div>
                )}

                {activeFilters?.type === 'transfer' && activeFilters?.transmitter_id && activeFilters?.transmitter_id.length > 0 && (
                    <div className="flex flex-row gap-x-2 items-center text-xs text-white bg-indigo-800 px-3 py-2 rounded-full">
                        <UserMinus className="size-4" />
                        <span>مبداء</span>
                    </div>
                )}

                {activeFilters?.type === 'transfer' && activeFilters?.receiver_id && activeFilters?.receiver_id.length > 0 && (
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