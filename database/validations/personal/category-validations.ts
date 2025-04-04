// database/validations/category-validation.ts
import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, 'نام دسته‌بندی الزامی است').max(255, 'نام نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),
});