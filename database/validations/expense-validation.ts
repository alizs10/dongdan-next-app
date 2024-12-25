import { z, ZodType } from "zod";
import { expendSchema } from "./expend-validation";
import { transferSchema } from "./transfer-validation";
import { Expense } from "@/types/event-types";
import { CreateExpendReqInputs, CreateTransferReqInputs } from "@/app/actions/event";

export const expenseSchema: ZodType<Expense> = z.union([expendSchema, transferSchema])


export const createExpendSchema: ZodType<CreateExpendReqInputs> = z.object({
    description: z.string().min(1, { message: 'توضیحات نمیتواند خالی باشد' }),
    amount: z.string().min(4, { message: 'مبلغ نمیتواند کمتر از 1000 تومان باشد' }),
    type: z.literal('expend'),
    date: z.date(),
    contributors: z.array(z.string()).min(1, { message: 'حداقل یک عضو باید انتخاب شود' }),
    payer_id: z.string().min(1, { message: 'کسی که پول را پرداخت میکند نمیتواند خالی باشد' }),
})

export const createTransferSchema: ZodType<CreateTransferReqInputs> = z.object({
    description: z.string().min(1, { message: 'توضیحات نمیتواند خالی باشد' }),
    amount: z.string().min(4, { message: 'مبلغ نمیتواند کمتر از 1000 تومان باشد' }),
    type: z.literal('transfer'),
    date: z.date(),
    transmitter_id: z.string().min(1, { message: 'پرداخت کننده نمیتواند خالی باشد' }),
    receiver_id: z.string().min(1, { message: 'دریافت کننده نمیتواند خالی باشد' }),
})