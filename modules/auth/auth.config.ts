import { logInfo } from "@/lib/logger";
import type { NextAuthConfig } from "next-auth";


//TODO: understand jwt and session callbacks
export const authConfig = {
  //here we can provide Google/ Gitub etc Auth
  providers: [],
  callbacks: {
    //
    jwt({ token, user }) {
      //what goes into the token
      if (user) {
        token.id = user.id;
        token.isSuperAdmin = (user as any).isSuperAdmin;
      }
      return token;
    },
    //what shape the client sees
    session({ session, token }) {
      session.user.id = token.id as string;
      (session.user as any).isSuperAdmin = token.isSuperAdmin;
      return session;
    },
  },
  session: { strategy: "jwt" }, //we can set token expiry time here
} satisfies NextAuthConfig;
