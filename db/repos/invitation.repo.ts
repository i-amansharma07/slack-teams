import { prisma } from "@/db/prisma";
import {
  Prisma,
  Invitation,
  InvitationStatus,
} from "@/lib/generated/prisma/client";

type Tx = Prisma.TransactionClient;
const invitation = prisma.invitation;

class InvitationRepoClass {
  findByToken(token: string): Promise<Invitation | null> {
    return invitation.findUnique({
      where: { token },
    });
  }

  markExpired(id: string): Promise<Invitation | null> {
    return invitation.update({
      where: { id },
      data: { status: InvitationStatus.expired },
    });
  }

  markAccepted(id: string, tx?: Tx) {
    const client = tx ? tx.invitation : invitation;
    return client.update({
      where: { id },
      data: { status: InvitationStatus.accepted },
    });
  }
}

export const InvitationRepo = new InvitationRepoClass();
