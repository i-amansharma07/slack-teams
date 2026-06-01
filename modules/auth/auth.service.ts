import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { RegisterDTO } from "./auth.schema";
import { BadRequestError, NotFoundError } from "@/shared/errors";
import { InvitationRepo } from "@/db/repos/invitation.repo";
import { UserRepo } from "@/db/repos/user.repo";
import { OrganizationRepo } from "@/db/repos/org.repo";
export class AuthService {
  // we will get {name, token, pass} here in params
  async register(data: RegisterDTO) {
    //checking out the invitation table and findig the invite to app
    //repo pattern
    /*  ***prod***  :  when super admin send invitation to the orgadmin
    that invite link is only valid for 7 days.
    */
    const invitation = await InvitationRepo.findByToken(data.token);

    //conditions to throw error if invitation is not there
    //or does not have status === "pending"
    if (!invitation) throw new NotFoundError("Invalid Token");

    if (invitation.status !== "pending")
      throw new BadRequestError("Token already used or expired");

    //token has been expired
    if (invitation.expiresAt < new Date()) {
      await InvitationRepo.markExpired(invitation.id);
      throw new BadRequestError("Token has expired");
    }


    // ***prod** orgadmin has invitation now registering in t
    // he app for the first time
    //and superadmin has already created a user in 
    // user's table with name and mail. 
    const user = await UserRepo.findByMail(invitation.email);

    if (!user) throw new NotFoundError("User Not Found");

    const passwordHash = await bcrypt.hash(data.password, 10);

    //user and org table has already been created
    // now update user, org and invitation table

    await prisma.$transaction(async (tx) => {
      await Promise.all([
        UserRepo.completeRegistration(user.id, data.name, passwordHash, tx),
        OrganizationRepo.markMemberActive(user.id, tx),
        InvitationRepo.markAccepted(invitation.id, tx),
      ]);
    });

    return { id: user.id, email: user.email, name: data.name };
  }
}
