import { CreateEventRequest, UpdateEventRequest } from "@/types/requests/events";
import { z, ZodType } from "zod";

const today = new Date();
today.setHours(23);
today.setMinutes(59);
today.setSeconds(59);
today.setMilliseconds(59);

export const createEventSchema: ZodType<CreateEventRequest> = z.object({
    name: z.string().min(3, 'نام رویداد نمیتواند کمتر از 3 کاراکتر باشد'),
    label: z.string().min(1, 'انتخاب برچسب الزامی است'),
    self_included: z.enum(['true', 'false']),
    contact_members: z.array(z.string()),
    start_date: z.coerce.date({ required_error: 'تاریخ الزامی است' }).max(today, 'تاریخ نمیتواند از تاریخ کنونی بیشتر باشد'),
})

export const updateEventSchema: ZodType<UpdateEventRequest> = z.object({
    name: z.string().min(3, 'نام رویداد نمیتواند کمتر از 3 کاراکتر باشد'),
    label: z.string().min(1, 'انتخاب برچسب الزامی است'),
    members: z.array(z.string()),
    contacts: z.array(z.string()),
    self_included: z.enum(['true', 'false']),
    start_date: z.coerce.date({ required_error: 'تاریخ الزامی است' }).max(today, 'تاریخ نمیتواند از تاریخ کنونی بیشتر باشد'),
})

