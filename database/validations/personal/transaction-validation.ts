import { z } from 'zod';

export const createTransactionSchema = z.object({
    user_id: z.string().min(1, 'شناسه کاربر الزامی است'),
    type: z.enum(['income', 'expense'], { message: 'نوع تراکنش باید درآمد یا هزینه باشد' }),
    title: z.string().min(1, 'عنوان الزامی است'),
    amount: z.string().regex(/^\d+$/, 'مبلغ باید عدد باشد').min(1, 'مبلغ الزامی است'),
    date: z.date({ message: 'تاریخ نامعتبر است' }),
    category_id: z.string().nullable().optional(),
    is_recurring: z.union([z.literal(0), z.literal(1)]),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable(),
}).refine(data => data.is_recurring === 0 || (data.is_recurring === 1 && data.frequency), {
    message: 'تکرار باید انتخاب شود اگر تراکنش تکرارشونده است',
    path: ['frequency'],
});