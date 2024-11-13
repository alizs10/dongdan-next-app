import { z } from "zod";

export const eventSchema = z.object({
    // id: z.string().min(1, 'شناسه رویداد نمیتواند خالی باشد'),
    name: z.string().min(3, 'نام رویداد نمیتواند کمتر از 3 کاراکتر باشد'),
    label: z.string().min(1, 'انتخاب برچسب الزامی است'),
    date: z.date({ required_error: 'تاریخ الزامی است' }),
})