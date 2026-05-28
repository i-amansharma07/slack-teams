import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterDTO } from "./auth.schema";
import { BadRequestError, NotFoundError } from "@/shared/errors";

export class AuthService {
  // we will get {name, token, pass} here in params
  async register(data: RegisterDTO) {
    //checking out the invitation table and findig the invite to app
    const invitation = await prisma.invitation.findUnique({
      where: { token: data.token },
    });

    console.log("****Step 1: Found Invitation****", invitation);

    //conditions to throw error if invitation is not there
    //or does not have status === "pending"
    if (!invitation) throw new NotFoundError("Invalid Token");

    console.log("****Step 2: Validating Invitation Status****", invitation.status);

    if (invitation.status !== "pending")
      throw new BadRequestError("Token already used or expired");

    console.log("****Step 3: Checking Token Expiry****", invitation.expiresAt);


    //token has been expired
    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "expired" },
      });
      throw new BadRequestError("Token has expired");
    }

    console.log("****Step 4: Fetching User by Email****", invitation.email);

    //user has invitation now registering in the app for the first time
    //but user already has an invitation table record so....
    const user = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (!user) throw new NotFoundError("User Not Found");

    console.log("****Step 5: Found User****", user);

    const passwordHash = await bcrypt.hash(data.password, 10);

    //user and org table has already been created
    // now update user, org and invitation table
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { name: data.name, passwordHash },
      }),
      prisma.orgMember.update({
        where: { userId: user.id },
        data: { status: "active" },
      }),
      prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "accepted" },
      }),
    ]);

    console.log("****Step 6: Registration Successful****", { id: user.id, email: user.email, name: data.name });
    return { id: user.id, email: user.email, name: data.name };
  }
}
