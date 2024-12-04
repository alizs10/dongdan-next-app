import crypto from 'crypto';
import prisma from "@/lib/db";
import { ResetPasswordToken } from '@prisma/client';
import { generateHTML, sendMail } from '@/lib/nodemailer';
import { zValidate } from '@/helpers/validation-helper';
import { forgotPasswordDataSchema } from '@/database/validations/auth-validation';

export async function POST(req: Request) {

    const formData = await req.formData();
    const email = formData.get('email') ?? ''

    // validate email

    let { hasError, errors } = zValidate(forgotPasswordDataSchema, { email })

    if (hasError) {
        console.log(errors)
        let errorMsg = "اطلاعات وارد شده صحیح نمی باشد!"
        return Response.json({ status: false, message: errorMsg, errors }, { status: 422, statusText: 'Unprocessable Entity!' })
    }

    // check if user exists
    const user = await prisma.user.findUnique({
        where: {
            email: email as string
        }
    })

    if (!user) {
        let errorMsg = "کاربر پیدا نشد"
        return Response.json({ status: false, message: errorMsg }, { status: 403 })
    }


    // check if user has a valid reset token

    const userResetTokenExists = await prisma.resetPasswordToken.findFirst({
        where: {
            userId: user.id
        }
    })

    if (userResetTokenExists && userResetTokenExists.expiresAt > new Date()) {
        let errorMsg = "ایمیل بازیابی قبلا برای شما ارسال شده است. ایمیل های خود را بررسی کنید یا پس از مدتی دوباره اقدام کنید."
        return Response.json({ status: false, message: errorMsg }, { status: 403 })
    }

    // generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpires: Date = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // save reset token to database
    let resetToken: ResetPasswordToken = await prisma.resetPasswordToken.create({
        data: {
            userId: user.id,
            email: user.email,
            token: token,
            expiresAt: tokenExpires
        }
    })

    // send email to user
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?email=${user.email}&token=${token}`
    await sendMail(user.email, 'Reset Password', generateHTML(user.name ?? user.email, resetLink))

    let successMsg = 'ایمیل بازیابی برای شما ارسال شد'
    return Response.json({ status: true, message: successMsg }, { status: 200 })

}