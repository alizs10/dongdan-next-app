import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import { CredentialsSignin, type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/db";
import { comparePassword } from "./lib/bcrypt";

class InvalidCredentialsError extends CredentialsSignin {
    code = "اطلاعات وارد شده اشتباه است"
}

class NoUserExistsError extends CredentialsSignin {
    code = "حسابی با این ایمیل وجود ندارد"
}

class InvalidPasswordError extends CredentialsSignin {
    code = "ایمیل یا رمز عبور اشتباه است"
}

class NoPasswordError extends CredentialsSignin {
    code = "حساب شما رمزعبوری ندارد. از طریق فراموشی رمزعبور اقدام کنید."
}

export default {
    providers: [GitHub, Google, Credentials({
        credentials: {
            email: { name: 'Email', type: 'email', placeholder: 'Example@example.com' },
            password: { name: 'Password', type: 'password' },
        },
        async authorize(credentials) {

            if (!credentials?.email || !credentials?.password) {
                throw new InvalidCredentialsError();
            }

            let user = await prisma.user.findUnique({
                where: {
                    email: credentials.email as string
                }
            })

            if (!user) {
                throw new NoUserExistsError();
            }

            if (!user?.password) {
                throw new NoPasswordError();
            }

            let isPasswordValid = await comparePassword(credentials.password as string, user.password)

            if (!isPasswordValid) {
                throw new InvalidPasswordError();
            }

            return user;
        },
    }),]
} satisfies NextAuthConfig;