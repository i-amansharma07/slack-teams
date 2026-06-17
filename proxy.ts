import NextAuth from "next-auth";
import { authConfig } from "./modules/auth/auth.config";
import { NextResponse } from "next/server";

//authConfig dont carry info of credentials which has db logic
const { auth } = NextAuth(authConfig);


export default auth((req) => {
  const isPublicRoute =
    req.nextUrl.pathname.startsWith("/api/auth/login") ||
    req.nextUrl.pathname.startsWith("/api/auth/register")  ||
    req.nextUrl.pathname.startsWith("/api/todos")

  if (!req.auth && !isPublicRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
})

export const config = {
  matcher: ["/api/:path*"],
}
