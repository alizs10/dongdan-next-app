import { Person } from "@/types/event-types";
import { z, ZodType } from "zod";

export const personSchema: ZodType<Person> = z.object({
    id: z.string().min(1, 'شناسه نمیتواند خالی باشد'),
    name: z.string().min(3, 'نام شخص نمیتواند کمتر از 3 کاراکتر باشد'),
    scheme: z.enum(['gray', 'blue', 'red', 'rose', 'green', 'orange', 'yellow', 'purple'], { required_error: 'انتخاب آواتار الزامی است', invalid_type_error: 'انتخاب آواتار الزامی است' }),
    eventId: z.string().min(1, 'رویداد الزامی است'),
})