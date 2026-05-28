import { LoginSchema } from "@/modules/auth/auth.schema";
//from auth config we created
import { signIn } from "@/modules/auth/auth";
import { handleError } from "@/shared/errors";

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const body = LoginSchema.parse(rawBody);
    //TODO: ask about this redirect:false
    const result = await signIn("credentials", { ...body, redirect: false });

    return Response.json({ message: "Login Successful" });
  } catch (error) {
    return handleError(error);
  }
}
