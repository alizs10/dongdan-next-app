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
    payer: z.string(),
    group: z.array(z.string()),
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
    to: z.string(),
    from: z.string(),
}).refine((data) => {
    const amountMin = TomanPriceToNumber(data.amountMin);
    const amountMax = TomanPriceToNumber(data.amountMax);
    return amountMin < amountMax;
}, {
    message: 'حداقل هزینه باید از حداکثر هزینه کمتر باشد',
    path: ['amountMin']
}).superRefine(({ from, to }, ctx) => {
    if (from.length > 0 && to.length > 0 && from === to) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'شخص مبداء و مقصد نمیتوانند یکسان باشند',
            path: ['to'], // Path to the field that has the issue
        })
    }
})