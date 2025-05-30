import { CreateTransactionRequest, UpdateTransactionRequest } from '@/types/requests/personal/transaction';
import { z, ZodType } from 'zod';

export const createTransactionSchema: ZodType<CreateTransactionRequest> = z.object({
    // user_id: z.string().min(1, 'شناسه کاربر الزامی است'),
    type: z.enum(['income', 'expense'], { message: 'نوع تراکنش باید درآمد یا هزینه باشد' }),
    title: z.string().min(1, 'عنوان الزامی است'),
    amount: z.number().min(1, 'مبلغ الزامی است'),
    date: z.date({ message: 'تاریخ نامعتبر است' }),
    description: z.string().nullable().optional(),
    category_ids: z.array(z.number()).optional().default([]),
    is_recurring: z.union([z.literal(0), z.literal(1)]),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable(),
    savings_goal_id: z.number().nullable().optional(), // Optional for new transactions
}).refine(data => data.is_recurring === 0 || (data.is_recurring === 1 && data.frequency), {
    message: 'تکرار باید انتخاب شود اگر تراکنش تکرارشونده است',
    path: ['frequency'],
})

export const updateTransactionSchema: ZodType<UpdateTransactionRequest> = z.object({
    id: z.number().min(1, 'شناسه تراکنش الزامی است'),
    // user_id: z.string().min(1, 'شناسه کاربر الزامی است'),
    type: z.enum(['income', 'expense'], { message: 'نوع تراکنش باید درآمد یا هزینه باشد' }),
    title: z.string().min(1, 'عنوان الزامی است'),
    amount: z.number().min(1, 'مبلغ الزامی است'),
    date: z.date({ message: 'تاریخ نامعتبر است' }),
    description: z.string().nullable().optional(),
    category_id: z.array(z.number()).optional().default([]),
    is_recurring: z.union([z.literal(0), z.literal(1)]),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable(),
}).refine(data => data.is_recurring === 0 || (data.is_recurring === 1 && data.frequency), {
    message: 'تکرار باید انتخاب شود اگر تراکنش تکرارشونده است',
    path: ['frequency'],
})