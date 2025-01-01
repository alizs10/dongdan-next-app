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
    password_confirmation: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
}).refine(data => data.password === data.password_confirmation, {
    message: "تکرار رمز عبور با رمز عبور هم خوانی ندارد",
    path: ["password_confirmation"]
});

export const forgotPasswordDataSchema = z.object({
    email: z.string().min(1, 'وارد کردن ایمیل ضروری است').email("آدرس ایمیل صحیح نمی باشد"),
})

export const resetPasswordDataSchema = z.object({
    token: z.string().min(1, 'وارد کردن توکن ضروری است').length(64, 'توکن معتبر نمی باشد'),
    password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
    password_confirmation: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
}).refine(data => data.password === data.password_confirmation, {
    message: "تکرار رمز عبور با رمز عبور هم خوانی ندارد",
})

export const changePasswordSchema = z.object({
    password: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
    new_password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
    new_password_confirmation: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
}).refine(data => data.new_password === data.new_password_confirmation, {
    message: "تکرار رمز عبور با رمز عبور هم خوانی ندارد",
    path: ["new_password_confirmation"]
})