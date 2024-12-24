import { SchemeType } from "@/types/event-types";
import { z, ZodType } from "zod";

type CreatePerson = {
    name: string;
    scheme: SchemeType;
}

export const createPersonSchema: ZodType<CreatePerson> = z.object({
    name: z.string().min(3, 'نام شخص نمیتواند کمتر از 3 کاراکتر باشد'),
    scheme: z.enum(['gray', 'blue', 'red', 'rose', 'green', 'orange', 'yellow', 'purple'], { required_error: 'انتخاب آواتار الزامی است', invalid_type_error: 'انتخاب آواتار الزامی است' }),
})