import { LoginSchema } from "@/modules/auth/auth.schema";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/modules/auth/auth";
import { BadRequestError, handleError } from "@/shared/errors";
import { withLogger } from "@/lib/with-logger";

export const POST = withLogger(async (req: Request) => {
  try {
    const rawBody = await req.json();
    const body = LoginSchema.safeParse(rawBody);
    if (!body.success) {
      throw new BadRequestError(body.error.message);
    }

    await signIn("credentials", { ...body.data, redirect: false });

    return Response.json({ message: "Login Successful" });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return Response.json(
        { error: "Unauthorized", message: "Invalid email or password" },
        { status: 401 },
      );
    }
    return handleError(error);
  }
});
