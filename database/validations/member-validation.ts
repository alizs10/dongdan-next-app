import { CreateMemberRequest } from '@/types/requests/event';
import { z, ZodType } from 'zod'

export const addMembersSchema: ZodType<CreateMemberRequest> = z.object({
    contacts: z.array(z.string()),
    self_included: z.enum(['true', 'false'])
})


export const createMemberSchema: ZodType<CreateMemberRequest> = z.object({
    name: z.string().min(3, 'نام شخص نمیتواند کمتر از 3 کاراکتر باشد'),
    scheme: z.enum(['gray', 'blue', 'red', 'rose', 'green', 'orange', 'yellow', 'purple'], { required_error: 'انتخاب آواتار الزامی است', invalid_type_error: 'انتخاب آواتار الزامی است' }),
    avatar: z.union([
        z.instanceof(File).nullable().refine((val) => {
            if (val === null) return true;
            const fileExtension = val.name.split('.').pop()?.toLowerCase();
            const validExtensions = ['png', 'jpeg', 'jpg', 'webp'];
            return fileExtension ? validExtensions.includes(fileExtension) : false;
        }, 'فرمت فایل باید png, jpeg, jpg یا webp باشد')
            .refine((val) => {
                if (val === null) return true;
                return val.size <= 2 * 1024 * 1024;
            }, 'حجم فایل نباید بیشتر از 2 مگابایت باشد'),
        z.null()
    ]).default(null),
    add_to_contacts: z.boolean()
})