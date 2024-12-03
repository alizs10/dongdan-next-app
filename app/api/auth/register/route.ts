import { registerDataSchema } from "@/database/validations/auth-validation";
import { zValidate } from "@/helpers/validation-helper";
import { hashPassword } from "@/lib/bcrypt";
import prisma from "@/lib/db";
import { User } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {

    let formData = await req.formData();

    let registerData = {
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    }

    let { hasError, errors } = zValidate(registerDataSchema, registerData)

    if (hasError) {
        console.log(errors)
        let errorMsg = "اطلاعات وارد شده صحیح نمی باشد!"
        return Response.json({ status: false, error: errorMsg, errors }, { status: 422, statusText: 'Unprocessable Entity!' })
    }

    let userExists = await prisma.user.findUnique({
        where: {
            email: registerData.email as string
        }
    })

    if (userExists) {
        return Response.json({ status: false, error: 'User Already Exists!' }, { status: 409, statusText: 'User Already Exists!' })
    }

    let hashedPassword = await hashPassword(registerData.password as string)

    let user: User = await prisma.user.create({
        data: {
            email: registerData.email as string,
            password: hashedPassword,
            avatar: 'grey'
        }
    })

    let successMsg = 'حساب کاربری با موفقیت ساخته شد.'

    return Response.json({ status: true, message: successMsg }, { status: 200, statusText: 'User Created Successfully!' })
}