import { prisma } from "@/db/prisma";
import {
  Prisma,
  Invitation,
  InvitationStatus,
  OrgRole,
} from "@/lib/generated/prisma/client";

type Tx = Prisma.TransactionClient;
const invitation = prisma.invitation;

function getClient(tx?: Tx) {
  return tx ? tx.invitation : invitation;
}

class InvitationRepoClass {
  
  create(
    data: {
      email: string;
      orgId: string;
      role: OrgRole;
      token: string;
      invitedBy: string;
      expiresAt: Date;
    },
    tx?: Tx,
  ): Promise<Invitation | null> {
    const client = getClient(tx);
    return client.create({
      data: {
        email: data.email,
        orgId: data.orgId,
        role: data.role,
        token: data.token,
        invitedBy: data.invitedBy,
        expiresAt: data.expiresAt,
      },
    });
  }

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
    const client = getClient(tx);
    return client.update({
      where: { id },
      data: { status: InvitationStatus.accepted },
    });
  }
}

export const InvitationRepo = new InvitationRepoClass();
