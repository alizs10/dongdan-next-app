import { z } from "zod";

export const loginDataSchema = z.object({
    email: z.string().min(1, 'وارد کردن ایمیل ضروری است').email("آدرس ایمیل صحیح نمی باشد"),
    password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
})

export const registerDataSchema = z.object({
    email: z.string().min(1, 'وارد کردن ایمیل ضروری است').email("آدرس ایمیل صحیح نمی باشد"),
    password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
    confirmPassword: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
}).refine(data => data.password === data.confirmPassword, {
    message: "تکرار رمز عبور با رمز عبور هم خوانی ندارد",
    path: ["confirmPassword"]
});