import { z } from "zod";

export const transferSchema = z.object({
    amount: z.string().min(1, 'هزینه الزامی است'),
    desc: z.string().min(3, 'توضیحات نمیتواند کمتر از 3 کاراکتر باشد'),
    date: z.date({ required_error: 'تاریخ الزامی است' }),
    from: z.string({ invalid_type_error: 'انتخاب شخص مبداء الزامی است' }).min(1, 'انتخاب شخص مبداء الزامی است'),
    to: z.string({ invalid_type_error: 'انتخاب شخص مقصد الزامی است' }).min(1, 'انتخاب شخص مقصد الزامی است'),
})