import { UpdateProfileRequest } from "@/types/requests/profile";
import { z, ZodType } from "zod";

export const updateProfileSchema: ZodType<UpdateProfileRequest> = z.object({
    name: z.string().min(3, 'نام شخص نمیتواند کمتر از 3 کاراکتر باشد'),
    email: z.string().email('آدرس ایمیل معتبر نیست'),
    scheme: z.enum(['gray', 'blue', 'red', 'rose', 'green', 'orange', 'yellow', 'purple'], { required_error: 'انتخاب آواتار الزامی است', invalid_type_error: 'انتخاب آواتار الزامی است' }),
})