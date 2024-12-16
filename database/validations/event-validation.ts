import { Event } from "@/types/event-types";
import { z, ZodType } from "zod";
import { personSchema } from "./person-validation";
import { expenseSchema } from "./expense-validation";

const today = new Date();
today.setHours(23);
today.setMinutes(59);
today.setSeconds(59);
today.setMilliseconds(59);

export const eventSchema: ZodType<Event> = z.object({
    // id: z.string().min(1, 'شناسه رویداد نمیتواند خالی باشد'),
    name: z.string().min(3, 'نام رویداد نمیتواند کمتر از 3 کاراکتر باشد'),
    label: z.string().min(1, 'انتخاب برچسب الزامی است'),
    date: z.coerce.date({ required_error: 'تاریخ الزامی است' }).max(today, 'تاریخ نمیتواند از تاریخ کنونی بیشتر باشد'),
    // members: z.array(personSchema),
    // expenses: z.array(expenseSchema),
    status: z.boolean(),
    // createdAt: z.date().max(today, 'تاریخ ساخت نمیتواند از تاریخ کنونی کمتر باشد'),
    // updatedAt: z.date().max(today, 'تاریخ بروزرسانی نمیتواند از تاریخ کنونی کمتر باشد'),
    // deletedAt: z.date().nullable(),
})