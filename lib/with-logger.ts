import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/modules/auth/auth";
import { logRequest } from "./logger";

//signature of the function which takes input as NextRequst and return
//Response in promise manner
type RouteHandler = (req: NextRequest) => Promise<Response>;

export function withLogger(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    const requestId = uuidv4();
    const start = Date.now();

    const response = await handler(req);

    const end = Date.now();

    const session = await auth();

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
