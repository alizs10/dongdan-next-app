import { ChangePasswordRequest, DeleteAccountRequest, ForgotPasswordRequest, LoginCredentialsRequest, RegisterCredentialsRequest, ResetPasswordRequest } from "@/types/requests/auth";
import { z, ZodType } from "zod";

export const loginCredentialsSchema: ZodType<LoginCredentialsRequest> = z.object({
    email: z.string().min(1, 'وارد کردن ایمیل ضروری است').email("آدرس ایمیل صحیح نمی باشد"),
    password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
})

export const registerCredentialsSchema: ZodType<RegisterCredentialsRequest> = z.object({
    email: z.string().min(1, 'وارد کردن ایمیل ضروری است').email("آدرس ایمیل صحیح نمی باشد"),
    password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
    password_confirmation: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
}).refine(data => data.password === data.password_confirmation, {
    message: "تکرار رمز عبور با رمز عبور هم خوانی ندارد",
    path: ["password_confirmation"]
});

export const forgotPasswordSchema: ZodType<ForgotPasswordRequest> = z.object({
    email: z.string().min(1, 'وارد کردن ایمیل ضروری است').email("آدرس ایمیل صحیح نمی باشد"),
})

export const resetPasswordSchema: ZodType<ResetPasswordRequest> = z.object({
    email: z.string().min(1, 'وارد کردن ایمیل ضروری است').email("آدرس ایمیل صحیح نمی باشد"),
    token: z.string().min(1, 'وارد کردن توکن ضروری است').length(64, 'توکن معتبر نمی باشد'),
    password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
    password_confirmation: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
}).refine(data => data.password === data.password_confirmation, {
    message: "تکرار رمز عبور با رمز عبور هم خوانی ندارد",
    path: ["password_confirmation"]
})

export const changePasswordSchema: ZodType<ChangePasswordRequest> = z.object({
    password: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
    new_password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
    new_password_confirmation: z.string().min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد"),
}).refine(data => data.new_password === data.new_password_confirmation, {
    message: "تکرار رمز عبور با رمز عبور هم خوانی ندارد",
    path: ["new_password_confirmation"]
})

export const deleteAccountSchema: ZodType<DeleteAccountRequest> = z.object({
    password: z.string()
        .min(8, "رمز عبور باید حداقل شامل 8 کارکتر باشد")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "رمز عبور باید حداقل شامل یک حرف لاتین بزرگ، کوچک، عدد و یک کارکتر خاص باشد"),
})