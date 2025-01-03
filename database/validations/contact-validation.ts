import { Contact, ContactInputs } from "@/types/contact-types";
import { z, ZodType } from "zod";

const today = new Date();
today.setHours(23);
today.setMinutes(59);
today.setSeconds(59);
today.setMilliseconds(59);

export const contactSchema: ZodType<Contact> = z.object({
    id: z.string().min(1, 'شناسه نمیتواند خالی باشد'),
    name: z.string().min(3, 'نام شخص نمیتواند کمتر از 3 کاراکتر باشد'),
    scheme: z.enum(['gray', 'blue', 'red', 'rose', 'green', 'orange', 'yellow', 'purple'], { required_error: 'انتخاب آواتار الزامی است', invalid_type_error: 'انتخاب آواتار الزامی است' }),
    created_at: z.date().max(today, 'تاریخ ساخت نمیتواند از تاریخ کنونی کمتر باشد'),
    updated_at: z.date().max(today, 'تاریخ بروزرسانی نمیتواند از تاریخ کنونی کمتر باشد'),
    deleted_at: z.date().nullable(),
})

export const newContactSchema: ZodType<ContactInputs> = z.object({
    name: z.string().min(3, 'نام شخص نمیتواند کمتر از 3 کاراکتر باشد'),
    scheme: z.enum(['gray', 'blue', 'red', 'rose', 'green', 'orange', 'yellow', 'purple'], { required_error: 'انتخاب آواتار الزامی است', invalid_type_error: 'انتخاب آواتار الزامی است' }),
})