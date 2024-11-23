import { Expend } from "@/types/event-types";
import { z, ZodType } from "zod";

const today = new Date();
today.setHours(23);
today.setMinutes(59);
today.setSeconds(59);
today.setMilliseconds(59);

export const expendSchema: ZodType<Expend> = z.object({
    id: z.string().min(1, 'شناسه هزینه نمیتواند خالی باشد'),
    type: z.literal('expend'),
    amount: z.number().min(1000, 'هزینه باید حداقل 1000 تومان باشد'),
    desc: z.string().min(3, 'توضیحات نمیتواند کمتر از 3 کاراکتر باشد'),
    date: z.coerce.date({ required_error: 'تاریخ الزامی است' }).max(today, 'تاریخ نمیتواند از تاریخ کنونی بیشتر باشد'),
    group: z.array(z.string()).min(1, 'انتخاب حداقل یک شخص الزامی است'),
    payer: z.string({ invalid_type_error: 'انتخاب پرداخت کننده الزامی است' }).min(1, 'انتخاب پرداخت کننده الزامی است'),
})