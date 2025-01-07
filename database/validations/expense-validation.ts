import { z, ZodType } from "zod";
import { expendSchema } from "./expend-validation";
import { transferSchema } from "./transfer-validation";
import { Expense } from "@/types/event-types";
import { CreateExpendReqInputs, CreateTransferReqInputs } from "@/app/actions/event";

export const expenseSchema: ZodType<Expense> = z.union([expendSchema, transferSchema])


export const createExpendSchema = z.object({
    description: z.string().min(1, { message: 'توضیحات نمیتواند خالی باشد' }),
    amount: z.string().min(4, { message: 'مبلغ نمیتواند کمتر از 1000 تومان باشد' }).optional(),
    type: z.literal('expend'),
    date: z.date(),
    contributors: z.array(z.string()).min(1, { message: 'حداقل یک نفر باید انتخاب شود' }).optional(),
    manual_contributors: z.array(z.object({
        event_member_id: z.string(),
        amount: z.string().min(4, { message: 'مبلغ نمیتواند کمتر از 1000 تومان باشد' }),
    })).min(1, { message: 'حداقل یک نفر باید انتخاب شود' }).optional(),
    payer_id: z.string().min(1, { message: 'یک نفر باید انتخاب شود' }),
}).refine(data => data.contributors || data.manual_contributors, {
    message: 'حداقل یکی از contributors یا manual_contributors باید وجود داشته باشد'
}).refine(data => {
    if (data.contributors) {
        return !!data.amount
    }
    return true
}, {
    message: 'مبلغ برای contributors اجباری است'
}).refine(data => {
    if (data.manual_contributors) {
        return !data.amount
    }
    return true
}, {
    message: 'در صورت وجود manual_contributors نباید مبلغ کل وارد شود'
}).refine(data => {
    return !(data.contributors && data.manual_contributors)
}, {
    message: 'نمیتوانید همزمان از contributors و manual_contributors استفاده کنید'
})


export const createTransferSchema: ZodType<CreateTransferReqInputs> = z.object({
    description: z.string().min(1, { message: 'توضیحات نمیتواند خالی باشد' }),
    amount: z.string().min(4, { message: 'مبلغ نمیتواند کمتر از 1000 تومان باشد' }),
    type: z.literal('transfer'),
    date: z.date(),
    transmitter_id: z.string().min(1, { message: 'پرداخت کننده نمیتواند خالی باشد' }),
    receiver_id: z.string().min(1, { message: 'دریافت کننده نمیتواند خالی باشد' }),
})