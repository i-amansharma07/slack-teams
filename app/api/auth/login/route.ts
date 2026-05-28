import { LoginSchema } from "@/modules/auth/auth.schema";
//from auth config we created
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

    //TODO: ask about this redirect:false
    await signIn("credentials", { ...body.data, redirect: false });

    return Response.json({ message: "Login Successful" });
  } catch (error) {
    return handleError(error);
  }
});
