import { prisma } from "@/db/prisma";
import { Prisma, User } from "@/lib/generated/prisma/client";

type Tx = Prisma.TransactionClient;
const user = prisma.user;

function getClient(tx?: Tx) {
  return tx ? tx.user : user;
}

class UserRepoClass {
  createPending(email: string, tx?: Tx) {
    const client = getClient(tx);
    return client.create({
      data: { email, name: "", passwordHash: "", isSuperAdmin: false },
    });
  }

  registerUser(
    email: string,
    name: string,
    passwordHash: string,
    isSuperAdmin: boolean,
    tx?: Tx,
  ): Promise<User | null> {
    const client = getClient(tx);
    return client.create({
      data: {
        email,
        name,
        passwordHash,
        isSuperAdmin,
      },
    });
  }

  findByMail(email: string, tx?: Tx): Promise<User | null> {
    const client = getClient(tx);
    return client.findUnique({
      where: { email },
    });
  }

  completeRegistration(
    id: string,
    name: string,
    passwordHash: string,
    tx?: Tx,
  ): Promise<User | null> {
    const client = getClient(tx);
    return client.update({
      where: { id },
      data: { name, passwordHash },
    });
  }
}

export const UserRepo = new UserRepoClass();
