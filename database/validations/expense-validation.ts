import { CreateExpendRequest, CreateTransferRequest } from "@/types/requests/event";
import { z, ZodType } from "zod";

export const createExpendSchema: ZodType<CreateExpendRequest> = z.object({
    description: z.string().min(1, { message: 'توضیحات نمیتواند خالی باشد' }),
    type: z.literal('expend'),
    date: z.date(),
    contributors: z.array(z.object({
        event_member_id: z.string(),
        amount: z.string().min(4, { message: 'مبلغ نمیتواند کمتر از 1000 تومان باشد' }),
    })).min(1, { message: 'حداقل یک نفر باید انتخاب شود' }),
    payer_id: z.string().min(1, { message: 'یک نفر باید انتخاب شود' }),
    equal_shares: z.literal(0).or(z.literal(1)),
})

export const createTransferSchema: ZodType<CreateTransferRequest> = z.object({
    description: z.string().min(1, { message: 'توضیحات نمیتواند خالی باشد' }),
    amount: z.string().min(4, { message: 'مبلغ نمیتواند کمتر از 1000 تومان باشد' }),
    type: z.literal('transfer'),
    date: z.date(),
    transmitter_id: z.string().min(1, { message: 'پرداخت کننده نمیتواند خالی باشد' }),
    receiver_id: z.string().min(1, { message: 'دریافت کننده نمیتواند خالی باشد' }),
})