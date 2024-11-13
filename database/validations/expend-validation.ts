import { z } from "zod";

export const expendSchema = z.object({
    amount: z.string().min(1, 'هزینه الزامی است'),
    desc: z.string().min(3, 'توضیحات نمیتواند کمتر از 3 کاراکتر باشد'),
    date: z.date({ required_error: 'تاریخ الزامی است' }),
    group: z.array(z.string()).min(1, 'انتخاب حداقل یک شخص الزامی است'),
    payer: z.string({ invalid_type_error: 'انتخاب پرداخت کننده الزامی است' }).min(1, 'انتخاب پرداخت کننده الزامی است'),
})