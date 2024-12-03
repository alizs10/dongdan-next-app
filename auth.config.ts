import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import { CredentialsSignin, type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/db";
import { comparePassword } from "./lib/bcrypt";

class InvalidLoginError extends CredentialsSignin {
    code = "Invalid identifier or password"
}

export default {
    providers: [GitHub, Google, Credentials({
        credentials: {
            email: { name: 'Email', type: 'email', placeholder: 'Example@example.com' },
            password: { name: 'Password', type: 'password' },
        },
        async authorize(credentials) {

            if (!credentials?.email || !credentials?.password) {
                return null;
            }

            let user = await prisma.user.findUnique({
                where: {
                    email: credentials.email as string
                }
            })

            if (!user || !user?.password) {
                return null;
            }

            let isPasswordValid = await comparePassword(credentials.password as string, user.password)

            if (!isPasswordValid) {
                return null;
            }

            return user;
        },
    }),]
} satisfies NextAuthConfig;