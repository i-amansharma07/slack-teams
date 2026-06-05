import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials"; // to sigin with custom mail and pass.
import { LoginSchema } from "./auth.schema";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { UserRepo } from "@/db/repos/user.repo";
import { cache } from "@/lib/cache";
import { CacheKeys } from "@/lib/cache-keys";

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedUser = LoginSchema.safeParse(credentials);

        if (!parsedUser.success)
          throw new InvalidCredentialsError("Invalid email or password format");

/*
       The login path calls `UserRepo.findByMail(email)` on every attempt. After the first successful
login, the same user object will be served from Redis for the next 10 minutes.
*/

        const user = await cache.wrap(
          CacheKeys.userByEmail(parsedUser.data.email),
          600, //10 mins
          () => UserRepo.findByMail(parsedUser.data.email),
        );

        if (!user)
          throw new InvalidCredentialsError("No account found with this email");

        const isValidUser: boolean = await bcrypt.compare(
          parsedUser.data.password,
          user.passwordHash,
        );

        if (!isValidUser)
          throw new InvalidCredentialsError("Incorrect password");

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
