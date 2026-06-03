import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/modules/auth/auth";
import { logRequest } from "./logger";
import { Session } from "next-auth";

//signature of the function which takes input as NextRequst and return
//Response in promise manner
type RouteHandler = (
  req: NextRequest,
  session?: Session | null,
) => Promise<Response>;

export function withLogger(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    const requestId = uuidv4();
    const start = Date.now();

    const session = await auth();
    const response = await handler(req, session);

    const end = Date.now();

    logRequest({
      requestId,
      method: req.method,
      path: req.nextUrl.pathname,
      status: response.status,
      duration: `${end - start}`,
      timestamp: new Date().toISOString(),
      userId: session?.user?.id,
      ip: req.headers.get("x-forwarded-for") ?? "unknown",
    });

    return response;
  };
}
