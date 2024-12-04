import { resetPasswordDataSchema } from "@/database/validations/auth-validation";
import { zValidate } from "@/helpers/validation-helper";
import { hashPassword } from "@/lib/bcrypt";
import prisma from "@/lib/db";
import { generateResetPasswordNotifyerHTML, sendMail } from "@/lib/nodemailer";


export async function POST(req: Request) {

    const formData = await req.formData();
    const token = formData.get('token')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    // validate inputs
    let inputs = {
        token, password, confirmPassword
    }

    let { hasError, errors } = zValidate(resetPasswordDataSchema, inputs)

    if (hasError) {
        console.log(errors)
        let errorMsg = "اطلاعات وارد شده صحیح نمی باشد!"
        return Response.json({ status: false, message: errorMsg, errors }, { status: 422, statusText: 'Unprocessable Entity!' })
    }

    let resetToken = await prisma.resetPasswordToken.findFirst({
        where: {
            token: token as string
        }
    })

    if (!resetToken) {
        let errorMsg = "توکن معتبر نمی باشد"
        return Response.json({ status: false, message: errorMsg }, { status: 403 })
    }

    if (resetToken.expiresAt < new Date()) {
        let errorMsg = "توکن منقضی شده است"
        return Response.json({ status: false, message: errorMsg }, { status: 403 })
    }

    let hashedPassword = await hashPassword(password as string)

    let user = await prisma.user.update({
        where: {
            id: resetToken.userId
        },
        data: {
            password: hashedPassword
        }
    })

    await prisma.resetPasswordToken.delete({
        where: {
            id: resetToken.id
        }
    })

    // notify user by email that its password has been reset
    await sendMail(user.email, 'NOTIFY: Password Changed', generateResetPasswordNotifyerHTML(user.name ?? user.email))

    let successMsg = "رمز عبور شما با موفقیت تغییر کرد"
    return Response.json({ status: true, message: successMsg }, { status: 200 })

}