import { z } from 'zod';

export const createBudgetLimitSchema = z.object({
    name: z.string().min(1, 'نام محدودیت الزامی است').max(255, 'نام نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),
    category_id: z.string().nullable(),
    amount: z.string().min(1, 'مبلغ الزامی است'),
    period: z.enum(['weekly', 'monthly', 'yearly'], {
        errorMap: () => ({ message: 'دوره نامعتبر است' }),
    }),
}); 