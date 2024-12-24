import { SchemeType } from '@/types/event-types';
import { z, ZodType } from 'zod'

type CreateMember = {
    name: string;
    scheme: SchemeType;
}

type AddMembers = {
    contacts: string[]
    self_included: 'true' | 'false'
}

export const addMembersSchema: ZodType<AddMembers> = z.object({
    contacts: z.array(z.string()),
    self_included: z.enum(['true', 'false'])
})


export const createMemberSchema: ZodType<CreateMember> = z.object({
    name: z.string().min(3, 'نام شخص نمیتواند کمتر از 3 کاراکتر باشد'),
    scheme: z.enum(['gray', 'blue', 'red', 'rose', 'green', 'orange', 'yellow', 'purple'], { required_error: 'انتخاب آواتار الزامی است', invalid_type_error: 'انتخاب آواتار الزامی است' }),
})