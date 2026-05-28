import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials"; // to sigin with custom mail and pass.
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "./auth.schema";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedUser = LoginSchema.safeParse(credentials);
        if (!parsedUser.success) throw new InvalidCredentialsError("Invalid email or password format");

        const user = await prisma.user.findUnique({
          where: { email: parsedUser.data.email },
        });

        if (!user) throw new InvalidCredentialsError("No account found with this email");

        const isValidUser: boolean = await bcrypt.compare(
          parsedUser.data.password,
          user.passwordHash,
        );

        if (!isValidUser) throw new InvalidCredentialsError("Incorrect password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isSuperAdmin: user.isSuperAdmin,
        };
      },
    }),
  ],
});
