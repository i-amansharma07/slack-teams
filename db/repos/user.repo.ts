import { prisma } from "@/db/prisma";
import { Prisma, User } from "@/lib/generated/prisma/client";

type Tx = Prisma.TransactionClient;
const user = prisma.user;

class UserRepoClass {
  findByMail(email: string): Promise<User | null> {
    return user.findUnique({
      where: { email },
    });
  }

  completeRegistration(
    id: string,
    name: string,
    passwordHash: string,
    tx?: Tx,
  ) {
    const client = tx ? tx.user :  user;
    return client.update({
      where: { id },
      data: { name, passwordHash },
    });
  }
}

export const UserRepo = new UserRepoClass();
