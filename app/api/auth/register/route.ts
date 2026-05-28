//container which has all the serices listed and exported as function
//TODO: search about container pattern and what do we call the
//architecture of the app
import { getAuthService } from "@/lib/container";
//zod schema
import { RegisterSchema } from "@/modules/auth/auth.schema";
//global error handling function
import { handleError } from "@/shared/errors";

export async function POST(req: Request) {
  try {
    //zod.safeParse will give object like {success, data}
    //zod.parse will throw error which will be catched and send apt.
    //error handler for it.
    const rawBody = await req.json();
    const body = RegisterSchema.parse(rawBody);
    const user = await getAuthService().register(body);
    return Response.json(user, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
