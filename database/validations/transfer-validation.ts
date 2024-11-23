import { Transfer } from "@/types/event-types";
import { z, ZodType } from "zod";

const today = new Date();
today.setHours(23);
today.setMinutes(59);
today.setSeconds(59);
today.setMilliseconds(59);

export const transferSchema: ZodType<Transfer> = z.object({
    id: z.string().min(1, 'شناسه جابجایی پول نمیتواند خالی باشد'),
    type: z.literal('transfer'),
    amount: z.number().min(1, 'هزینه الزامی است'),
    desc: z.string().min(3, 'توضیحات نمیتواند کمتر از 3 کاراکتر باشد'),
    date: z.coerce.date({ required_error: 'تاریخ الزامی است' }).max(today, 'تاریخ نمیتواند از تاریخ کنونی بیشتر باشد'),
    from: z.string({ invalid_type_error: 'انتخاب شخص مبداء الزامی است' }).min(1, 'انتخاب شخص مبداء الزامی است'),
    to: z.string({ invalid_type_error: 'انتخاب شخص مقصد الزامی است' }).min(1, 'انتخاب شخص مقصد الزامی است'),
}).superRefine(({ from, to }, ctx) => {
    if (from === to) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'شخص مبداء و مقصد نمیتوانند یکسان باشند',
            path: ['to'], // Path to the field that has the issue
        })
    }
})