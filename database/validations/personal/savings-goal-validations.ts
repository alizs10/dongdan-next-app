import { z } from 'zod';

export const createSavingsGoalSchema = z.object({
    name: z.string().min(1, 'نام هدف الزامی است').max(255, 'نام نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),
    target_amount: z.string().min(1, 'مبلغ هدف الزامی است'),
    due_date: z.date({ message: 'تاریخ نامعتبر است' }),
}); 