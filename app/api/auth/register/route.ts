//container which has all the serices listed and exported as function
//TODO: search about container pattern and what do we call the
//architecture of the app
import { getAuthService } from "@/lib/container";
import { withLogger } from "@/lib/with-logger";
//zod schema
import { RegisterSchema } from "@/modules/auth/auth.schema";
//global error handling function
import { BadRequestError, handleError } from "@/shared/errors";

export const POST = withLogger(async (req: Request) => {
  try {
    //zod.safeParse will give object like {success, data}
    //zod.parse will throw error which will be catched and send apt.
    //error handler for it.
    const rawBody = await req.json();
    const body = RegisterSchema.safeParse(rawBody);
    if(!body.success){
      throw new BadRequestError(body.error.message);
    }
    const user = await getAuthService().register(body.data);
    return Response.json(user, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
})
