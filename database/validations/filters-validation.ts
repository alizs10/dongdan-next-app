import { TomanPriceToNumber } from "@/helpers/helpers";
import { AnyExpense, ExpendFilter, TransferFilter } from "@/types/event-types";
import { z, ZodType } from "zod"

export const anyFilterSchema: ZodType<AnyExpense> = z.object({
    type: z.enum(['any']),
    amountMin: z.string().min(1, 'فیلتر هزینه الزامی می باشد'),
    amountMax: z.string().min(1, 'فیلتر هزینه الزامی می باشد'),
    dateRange: z.tuple([z.date(), z.date()]).refine(([start, end]) => start < end, {
        message: 'تاریخ شروع باید کمتر از تاریخ پایان باشد',
    })
}).refine((data) => {
    const amountMin = TomanPriceToNumber(data.amountMin);
    const amountMax = TomanPriceToNumber(data.amountMax);
    return amountMin < amountMax;
}, {
    message: 'حداقل هزینه باید از حداکثر هزینه کمتر باشد',
    path: ['amountMin']
})

export const expendFilterSchema: ZodType<ExpendFilter> = z.object({
    type: z.literal('expend'),
    amountMin: z.string().min(1, 'فیلتر هزینه الزامی می باشد'),
    amountMax: z.string().min(1, 'فیلتر هزینه الزامی می باشد'),
    dateRange: z.tuple([z.date(), z.date()]).refine(([start, end]) => start < end, {
        message: 'تاریخ شروع باید کمتر از تاریخ پایان باشد',
    }),
    payer_id: z.string(),
    contributors: z.array(z.string()),
}).refine((data) => {
    const amountMin = TomanPriceToNumber(data.amountMin);
    const amountMax = TomanPriceToNumber(data.amountMax);
    return amountMin < amountMax;
}, {
    message: 'حداقل هزینه باید از حداکثر هزینه کمتر باشد',
    path: ['amountMin']
})

export const transferFilterSchema: ZodType<TransferFilter> = z.object({
    type: z.literal('transfer'),
    amountMin: z.string().min(1, 'فیلتر هزینه الزامی می باشد'),
    amountMax: z.string().min(1, 'فیلتر هزینه الزامی می باشد'),
    dateRange: z.tuple([z.date(), z.date()]).refine(([start, end]) => start < end, {
        message: 'تاریخ شروع باید کمتر از تاریخ پایان باشد',
    }),
    receiver_id: z.string(),
    transmitter_id: z.string(),
}).refine((data) => {
    const amountMin = TomanPriceToNumber(data.amountMin);
    const amountMax = TomanPriceToNumber(data.amountMax);
    return amountMin < amountMax;
}, {
    message: 'حداقل هزینه باید از حداکثر هزینه کمتر باشد',
    path: ['amountMin']
}).superRefine(({ transmitter_id, receiver_id }, ctx) => {
    if (transmitter_id.length > 0 && receiver_id.length > 0 && transmitter_id === receiver_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'شخص مبداء و مقصد نمیتوانند یکسان باشند',
            path: ['receiver_id'], // Path to the field that has the issue
        })
    }
})