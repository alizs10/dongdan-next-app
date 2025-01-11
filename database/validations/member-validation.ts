import { CreateMemberRequest } from '@/types/requests/event';
import { z, ZodType } from 'zod'

export const addMembersSchema: ZodType<CreateMemberRequest> = z.object({
    contacts: z.array(z.string()),
    self_included: z.enum(['true', 'false'])
})


export const createMemberSchema: ZodType<CreateMemberRequest> = z.object({
    name: z.string().min(3, 'نام شخص نمیتواند کمتر از 3 کاراکتر باشد'),
    scheme: z.enum(['gray', 'blue', 'red', 'rose', 'green', 'orange', 'yellow', 'purple'], { required_error: 'انتخاب آواتار الزامی است', invalid_type_error: 'انتخاب آواتار الزامی است' }),
})